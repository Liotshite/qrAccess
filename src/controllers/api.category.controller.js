const categoryService = require('../services/category.service');

// list cat
exports.renderCats = async (req, res) => {
    const cats = await categoryService.findAll();
    const nbr = await categoryService.countCats();
    res.status(200).json({ cats, nbr });
}



// post in BDD cat
exports.createCat = async (req, res) => {
    try {
        const { catname } = req.body;
        var cat = await categoryService.findByName(catname);

        if (!cat) {
            const userId = req.user.id;
            cat = {
                catname: catname,
                userId: userId,
            }
            await categoryService.createCat(cat);
            res.status(200).json({ message: "Category created" });
        } else {
            res.status(200).json({ message: "Category already exist" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Une erreur s\'est produit.');
    }
}


// delete cat
exports.deletecat = async (req, res) => {
    try {
        const { id } = req.params;
        await categoryService.deleteCat(id);
        res.status(200).json({ message: "Category deleted" });
    } catch (error) {
        console.error(error);
        res.status(500).send('Une erreur s\'est produit.');
    }
}