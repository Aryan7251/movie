import express from 'express';
import { getAdsConfig, updateAdsConfig } from '../services/ads.service.js';
import { protectAdmin } from '../middleware/auth.middleware.js';

const router = express.Router();

// Public route to fetch active ad config
router.get('/config', (req, res) => {
  res.json(getAdsConfig());
});

// Admin-only route to update ad config
router.put('/config', protectAdmin, (req, res) => {
  const updated = updateAdsConfig(req.body);
  res.json({
    success: true,
    message: 'Ad configuration updated successfully',
    config: updated
  });
});

export default router;
