const express = require('express');
const router = express.Router();
const Link = require('../models/Link');
const bcrypt = require('bcrypt');
const { generateAlias } = require('../utils/shortid');

// create link
// body: { target, alias (optional), password (optional), expireInSeconds (optional), customTitle (optional) }
router.post('/create', async (req, res) => {
  try {
    const { target, alias, password, expireInSeconds, customTitle } = req.body;
    if (!target) return res.status(400).json({ error: 'target required' });

    let finalAlias = alias ? alias.trim() : generateAlias();

    // if alias exists, error
    const existing = await Link.findOne({ alias: finalAlias });
    if (existing) return res.status(409).json({ error: 'alias_taken' });

    let passwordHash = null;
    if (password && password.length > 0) {
      passwordHash = await bcrypt.hash(password, 10);
    }

    let expireAt = null;
    if (expireInSeconds && Number(expireInSeconds) > 0) {
      expireAt = new Date(Date.now() + Number(expireInSeconds) * 1000);
    }

    const link = new Link({
      alias: finalAlias,
      target,
      customTitle,
      passwordHash,
      expireAt
    });

    await link.save();

    res.json({
      alias: finalAlias,
      shortUrl: `${process.env.BASE_URL}/r/${finalAlias}`,
      target,
      expireAt
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'server_error' });
  }
});

// get metadata for alias (check if password protected)
router.get('/meta/:alias', async (req, res) => {
  try {
    const { alias } = req.params;
    const link = await Link.findOne({ alias });
    if (!link) return res.status(404).json({ error: 'not_found' });

    const isProtected = !!link.passwordHash;
    res.json({
      alias: link.alias,
      customTitle: link.customTitle,
      isProtected,
      clicks: link.clicks,
      expireAt: link.expireAt
    });
  } catch (err) {
    res.status(500).json({ error: 'server_error' });
  }
});

// verify password and redirect (POST)
// body: { password }
router.post('/access/:alias', async (req, res) => {
  try {
    const { alias } = req.params;
    const { password } = req.body;
    const link = await Link.findOne({ alias });
    if (!link) return res.status(404).json({ error: 'not_found' });

    // check expiry again (could be removed by TTL, but double-check)
    if (link.expireAt && link.expireAt < new Date()) {
      return res.status(410).json({ error: 'expired' });
    }

    if (link.passwordHash) {
      if (!password) return res.status(401).json({ error: 'password_required' });
      const ok = await bcrypt.compare(password, link.passwordHash);
      if (!ok) return res.status(403).json({ error: 'wrong_password' });
    }

    // increment clicks
    link.clicks = (link.clicks || 0) + 1;
    await link.save();

    // redirect
    return res.json({ redirectTo: link.target });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'server_error' });
  }
});

// optional: list links (for demo)
router.get('/list', async (req, res) => {
  const links = await Link.find().sort({ createdAt: -1 }).limit(100);
  res.json(links.map(l => ({
    alias: l.alias, target: l.target, clicks: l.clicks, expireAt: l.expireAt, customTitle: l.customTitle
  })));
});

module.exports = router;
