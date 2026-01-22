const categoryService = require('../services/category.service');

exports.renderCats = async (req,res) => {
  const cats = await categoryService.findAll();
  const nbr = await categoryService.countCats();
  res.render("event/listEvents",{cats,nbr});
}


exports.renderViewCats = async (res,req) => {
  res.render("event/viewEvent");
 }


exports.renderCreateCat = async (req,res) => {
  res.render("event/createEvent",{categories});
}

exports.createCat = async (req,res) => {
  try {
    const {catname} = req.body;
    var cat = await categoryService.findByName(catname);
    
    if (!cat) {
      const userId = req.user.id;
      cat = {  catname: catname, 
                userId: userId,
              }
      await categoryService.createCat(cat);
      res.redirect('/event/events?Category created');
    }else{
      res.redirect('/event/events?Category already exist');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Une erreur s\'est produit.');
  }
}