const express = require("express");
const router = express.Router();

const User = require("../models/user");

router.get("/:userId/crud", async (req, res) => {
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

//=====================================================

// stuuf here are deletable

router.get("/:userId/crud/author", async (req, res) => {
  try {
    const creater = await User.findById(req.params.userId);

    // console.log(`creater by  story` + createrbystory);
    res.render("crud/creater.ejs", {
      stories: creater.stories,
      creater,
    });
  } catch (error) {
    console.log(error);
    // res.redirect("/");
  }
});

//=====================================================

router.get("/:userId/crud/view", async (req, res) => {
  try {
    const currentUser = await User.findById(req.session.user._id);
    const users = await User.find({});
    res.render("crud/all.ejs", { users, currentUser });
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
});

router.get("/:userId/crud/new", async (req, res) => {
  res.render("crud/new.ejs");
});

router.post("/:userId/crud", async (req, res) => {
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

router.get("/:userId/crud/:crudId", async (req, res) => {
  try {
    const currentUser = await User.findById(req.session.user._id);
    let userWithStory;
    const users = await User.find({});
    let story = null;
    let compare = 2;

    for (let user of users) {
      story = user.stories.id(req.params.crudId);
      userWithStory = users.find((user) => user.stories.id(req.params.userId));
      if (story) {
        compare = user;
        break;
      }
    }

    compare1 = compare.id;
    compare2 = currentUser.id;

    // const creater = userWithStory.id;

    res.render("crud/show.ejs", {
      story,
      users,
      currentUser,
      compare1,
      compare2,
      compare,
      // creater,
    });
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
});

router.delete("/:userId/crud/:crudId", async (req, res) => {
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

router.get("/:userId/crud/:crudId/edit", async (req, res) => {
  try {
    const currentUser = await User.findById(req.session.user._id);
    if (req.params.userId == currentUser) {
      const story = currentUser.stories.id(req.params.crudId);
      const formattedDate = story.date.toISOString().split("T")[0];
      res.render("crud/edit.ejs", {
        story,
        formattedDate,
      });
    } else {
      res.redirect("/:crudId/edit/public");
    }
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
});

router.put("/:userId/crud/:crudId/edit", async (req, res) => {
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

router.get("/:userId/crud/:crudId/edit/public", async (req, res) => {
  try {
    const currentUser = await User.findById(req.session.user._id);
    creater = await User.findOne({
      stories: { $elemMatch: { _id: req.params.crudId } },
    });
    const story = creater.stories.id(req.params.crudId);
    //formattedDate = currentUser.stories.date.toISOString().split("T")[0];

    res.render("crud/editp.ejs", {
      story,
      // formattedDate,
    });
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
});

router.put("/:userId/crud/:crudId/edit/public", async (req, res) => {
  try {
    // const currentUser = await User.findById(req.session.user._id);
    // await currentUser.stories.id(req.params.crudId).set(req.body);

    creater = await User.findOne({
      stories: { $elemMatch: { _id: req.params.crudId } },
    });
    // const story = creater.stories.id(req.params.crudId);
    await creater.stories.id(req.params.crudId).set(req.body);
    await creater.save();
    res.redirect(`/users/${req.params.userId}/crud/${req.params.crudId}`);
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
});

module.exports = router;
