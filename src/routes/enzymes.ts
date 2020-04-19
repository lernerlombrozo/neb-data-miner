import { Router } from 'express';

import { getEnzymes, getEnzymesPDF } from '../controllers/enzymes';

const router = Router();

router.get('/', getEnzymes);
router.get('/pdf', getEnzymesPDF);

export default router;