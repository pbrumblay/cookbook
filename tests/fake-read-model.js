'use strict';

let recipes = [
    {
        "Name":"Lemongrass Soup with Shrimp (Thom Yum Koong)",
        "Description":"An awesome lemongrass soup -- and I don't even like shrimp!",
        "Source":"Nita Chittivej - theseasonedchef.com",
        "Instructions":"Lemongrass stock:\r\nShell and de-vein shrimp. Set shrimp aside. Saute shells in skillet to bring out shrimp flavor. Transfer to a large stockpot filled with 8 cups of water and bring to boil for 20 minutes. Remove and discard shells. Next add lemongrass, galangal, onion, torn kaffir lime leaves, and place soup on high heat an additional 20 minutes. \r\n\r\nAdd shrimp, tomato, mushrooms, fish sauce, lime juice, chili paste, and sugar. Return to simmer for 1 minute and serve with garnish (cilantro, scallions, jalapeno).\r\n\r\nTaste should be hot, salty, and sour.",
        "IngredientsSearchText":" fresh whole shrimp lemongrass thinly sliced galangal root white onion (cut into large pieces) kaffir lime leaves large tomato straw mushrooms fish sauce fresh lime juice roasted chili paste sugar cilantro thinly sliced scallions sliced jalapeno",
        "Visible":true,
        "Ingredients":[
            {
                "Name":"fresh whole shrimp",
                "Amount":"2 lbs"
            },
            {
                "Name":"lemongrass",
                "Amount":"2 stalks"
            }
        ],
        "CategoryName":"Thai",
        "Id":1
    },
    {
        "Name":"Chicken Fajitas",
        "Description":"A fajita recipe from the kitchen of Mom.",
        "Source":"Mom",
        "Instructions":"Cut chicken into 1/4\" strips. Slice onion into rings. Cut bell peppers into strips. Mince garlic cloves.\r\n\r\n1. Make the marinade for the chicken.\r\n\r\nPour the lime juice, worcestershire sauce, soy sauce, and vinegar into a shallow bowl. Add minced garlic cloves, tabasco, cumin, salt and pepper. Mix the marinade together and add the chicken strips. Cover and marinate for at least 2 hours in the refridgerator, stirring occasionally.\r\n\r\n2. Wrap the tortillas in foil. Warm in 300 deg. oven for 15 minutes. Heat olive oil in large nonstick skillet. Add chicken (throw marinade away). Add onion and bell peppers. Saute for about 10 minutes or until chicken is done. \r\n\r\nServe with chedder cheese, salsa, tomatoes, sour cream, and guacamole -- if you have it.",
        "IngredientsSearchText":" lime juice worcestershire sauce soy sauce vinegar garlic cloves tabasco cumin salt pepper boneless, skinless chicken breasts 8\" tortillas olive oil red onion green bell pepper red bell pepper",
        "Visible":true,
        "Favorite":false,
        "Ingredients":[
            {
                "Name":"lime juice",
                "Amount":"1/4 cup"
            },
            {
                "Name":"worcestershire sauce",
                "Amount":"1/4 cup"
            }
        ],
        "CategoryName":"Mexican",
        "Id":2
    },
    {
        "Name":"Southwestern Lasagna",
        "Description":"A nice change from classic lasagna.",
        "Source":"Taste of Home Magazine",
        "Instructions":"In a large skillet brown beef and onion.  Drain.  Stir in enchilada sauce, tomatoes, olives, salt, garlic, and pepper.  Bring to a boil, reduce heat, and simmer uncovered, 20 minutes.  In a small bowl, mix cottage cheese and egg.  Set aside.  \r\n\r\nSpread 1/3 meat sauce in a greased 9\" x 13\" baking dish.  Top with 1/2 the Jack cheese, 1/2 the cottage cheese mixture, and 1/2 the tortillas.  Repeat layers ending with meat sauce.  Sprinkle with cheddar cheese.  Cover and bake 20 minutes at 350 degrees.  Uncover and bake 10 minutes longer. \r\n\r\nServes:  6 - 8",
        "IngredientsSearchText":" Ground Beef Onion (Chopped) Enchilada Sauce Tomatoes (Diced, undrained) Ripe Olives (Sliced) Black Pepper Salt Garlic (Minced) Small Curd Cottage Cheese Egg Jack Cheese (Thinly Sliced) Corn Tortillas (8\", Quartered) Cheddar Cheese (Shredded)",
        "Visible":true,
        "Favorite":true,
        "Ingredients":[
            {
                "Name":"Ground Beef",
                "Amount":"1 1/2  Pounds"
            },
            {
                "Name":"Onion (Chopped)",
                "Amount":"1"
            }
        ],
        "CategoryName":"Mexican",
        "Id":3
    },
    {
        "Name":"Potion of Invisibility",
        "Description":"This recipe is invisible",
        "Visible":true,
        "Favorite":false,
        "Ingredients":[],
        "CategoryName":"Mexican",
        "Id":4
    }
];

class FakeReadModel {
    getAll() {
        return new Promise(function (resolve, reject) {
            resolve(recipes);
        });
    }

    getRecipeById(id) {
        return new Promise(function (resolve, reject) {
            var result = recipes.find(function (r) {
                return r.Id == id;
            });
            resolve(result);
        });
    }
}

module.exports = FakeReadModel;