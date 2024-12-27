module.exports = (req, res, next) => {
    const { title, content } = req.body;
    if (!title || !content) {
      return res.status(400).json({ error: 'Both title and content are required' });
    }
    next();
  };
  