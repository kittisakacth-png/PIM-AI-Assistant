const express = require("express");
const router = express.Router();

const db = require("../config/firebase");

router.get("/", async (req, res) => {

  try {

    const snapshot = await db
      .collection("documents")
      .orderBy("createdAt", "desc")
      .get();

    const documents = [];

    snapshot.forEach((doc) => {

      const data = doc.data();

      documents.push({
        id: doc.id,
        fileName: data.fileName,
        createdAt: data.createdAt
      });

    });

    res.json(documents);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: error.message
    });

  }

});

router.delete("/:id", async (req, res) => {

  try {

    await db
      .collection("documents")
      .doc(req.params.id)
      .delete();

    res.json({
      success: true
    });

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }

});

module.exports = router;