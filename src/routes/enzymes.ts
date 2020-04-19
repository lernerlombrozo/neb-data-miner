import { Router } from 'express';

import { getEnzymes } from '../controllers/enzymes';

const router = Router();

router.get('/', getEnzymes);

export default router;