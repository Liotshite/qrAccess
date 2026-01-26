const categoryService = require('../services/category.service');

// render list event
exports.renderCats = async (req,res) => {
  const cats = await categoryService.findAll();
  const nbr = await categoryService.countCats();
  res.render("category/listCat",{cats,nbr});
}


 // render creation event
exports.renderCreateCat = async (req,res) => {
  res.render("category/createCat");
}


// post in BDD event
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
      res.redirect('/cat/cats?Category created');
    }else{
      res.redirect('/cat/cats?Category already exist');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Une erreur s\'est produit.');
  }
}


// delete event
exports.deletecat = async (res,req) => {

}