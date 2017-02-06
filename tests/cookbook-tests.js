const test = require('tape');
const FakeModel = require('./fake-model');
const proxyquire =  require('proxyquire');
const fakeModel = new FakeModel();
let stub = {
    getRecipeById: fakeModel.getRecipeById
}


const sut = proxyquire('../api/cookbook', {
    './model/read-model': FakeModel,
    './model/write-model': stub
});

const request = {
  params: {
      param: 19
  }
};

function reply(recipe) {
    return recipe;
}

test('Find a Recipe by Id', function (t) {
    let result = sut.get(request, reply);
    t.equal(result.Name, "Potion of Invisibility");
    t.end();
});