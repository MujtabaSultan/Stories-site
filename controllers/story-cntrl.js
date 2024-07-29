const express = require("express");
const router = express.Router();

const User = require("../models/user");

router.get("/", async (req, res) => {
  try {
    const currentUser = await User.findById(req.session.user._id);
    res.render("crud/index.ejs", {
      stories: currentUser.stories,
    });
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
});

router.get("/view", async (req, res) => {
  try {
    const users = await User.find({});
    res.render("crud/all.ejs", { users });
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
});

router.get("/new", async (req, res) => {
  res.render("crud/new.ejs");
});

router.post("/", async (req, res) => {
  try {
    const currentUser = await User.findById(req.session.user._id);
    req.body.date = new Date(req.body.date);

    if (req.body.editable === "on") {
      req.body.editable = true;
    } else {
      req.body.editable = false;
    }
    currentUser.stories.push(req.body);
    await currentUser.save();
    res.redirect(`/users/${currentUser._id}/crud`);
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
});

router.get("/:crudId", async (req, res) => {
  try {
    const users = await User.find({});
    const currentUser = await User.findById(req.session.user._id);
    const stories = currentUser.stories.id(req.params.crudId);

    const allStories = [];

    currentUser.forEach((user) => {
      user.stories.forEach((story) => {
        allStories.push(story);
      });
    });

    res.render("crud/show.ejs", {
      stories,
      users,
      allStories,
    });
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
});

router.delete("/:crudId", async (req, res) => {
  try {
    const currentUser = await User.findById(req.session.user._id);
    currentUser.stories.id(req.params.crudId).deleteOne();
    await currentUser.save();
    res.redirect(`/users/${currentUser._id}/crud`);
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
});

router.get("/:crudId/edit", async (req, res) => {
  try {
    const currentUser = await User.findById(req.session.user._id);
    const story = currentUser.stories.id(req.params.crudId);
    const formattedDate = story.date.toISOString().split("T")[0];
    res.render("crud/edit.ejs", {
      story,
      formattedDate,
    });
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
});

router.put("/:crudId/edit", async (req, res) => {
  try {
    const currentUser = await User.findById(req.session.user._id);
    req.body.date = new Date(req.body.date);

    if (req.body.editable === "on") {
      req.body.editable = true;
    } else {
      req.body.editable = false;
    }
    await currentUser.stories.id(req.params.crudId).set(req.body);
    await currentUser.save();
    res.redirect("/");
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
});

module.exports = router;
