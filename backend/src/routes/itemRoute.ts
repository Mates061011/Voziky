// routes/itemRoutes.ts
import express, { Request, Response } from 'express';
import {Item} from '../models/itemModel';
import verifyToken from './../middleware/authMiddleware';
const router = express.Router();

// Route to create a new item (protected)
router.post('/add', verifyToken, async (req: Request, res: Response): Promise<void> => {
  const { name, desc, pricePerDay, pricePerDays, type, img, kauce, hidden } = req.body;

  try {
    // Ensure img is an array of strings, even if it's passed as a single string
    const imgArray = Array.isArray(img) ? img : [img];

    // Create a new item with the provided data
    const newItem = new Item({
      name,
      desc,
      pricePerDay,
      pricePerDays,
      type,
      img: imgArray,
      kauce,
      hidden,
    });

    // Save the new item to the database
    const savedItem = await newItem.save();
    res.status(201).json(savedItem); // Send back the saved item
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ message: 'Chyba serveru', error: error.message });
    } else {
      res.status(500).json({ message: 'Chyba serveru' });
    }
  }
});

router.put('/update/:id', verifyToken, async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params; // Get the item ID from the URL

  try {
    // Find the item by its ID
    const item = await Item.findById(id);

    if (!item) {
      res.status(404).json({ message: 'Item not found' });
      return;
    }

    // Toggle the 'hidden' field
    item.hidden = !item.hidden;

    // Save the updated item with the toggled 'hidden' value
    const updatedItem = await item.save();

    res.status(200).json(updatedItem); // Send back the updated item
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ message: 'Chyba serveru', error: error.message });
    } else {
      res.status(500).json({ message: 'Chyba serveru' });
    }
  }
});


router.get('/optionalAuth', verifyToken, async (req: Request, res: Response): Promise<void> => {
  try {
    // Fetch all items from the database
    const items = await Item.find();
    res.status(200).json(items); // Send back the list of items
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ message: 'Chyba serveru', error: error.message });
    } else {
      res.status(500).json({ message: 'Chyba serveru' });
    }
  }
});
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    // Fetch all items from the database where hidden is false
    const items = await Item.find({ hidden: false });

    res.status(200).json(items); // Send back the list of visible items
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ message: 'Chyba serveru', error: error.message });
    } else {
      res.status(500).json({ message: 'Chyba serveru' });
    }
  }
});

export default router;
