var _ = require('lodash')

// 1) =============循环
_.times(3, function () {
    console.log(1)
})

// 2) =============从对象里取值
// Fetch the name of the first pet from each owner
var ownerArr = [{
    "owner": "Colin",
    "pets": [{ "name": "dog1" }, { "name": "dog2" }]
}, {
    "owner": "John",
    "pets": [{ "name": "dog3" }, { "name": "dog4" }]
}];

// Array's map method.
ownerArr.map(function (owner) {
    return owner.pets[0].name;
});

// Lodash
_.map(ownerArr, 'pets[0].name');



// 3) ========== Create an array of length 6 and populate them with unique values. The value must be prefix with "ball_".
// eg. [ball_0, ball_1, ball_2, ball_3, ball_4, ball_5]

// Array's map method.
Array.apply(null, Array(6)).map(function(item, index){
    return "ball_" + index;
});


// Lodash
_.times(6, _.uniqueId.bind(null, 'ball_'));

//Get rid of the .bind(null,...)
_.times(6, _.partial(_.uniqueId, 'ball_'));


// 4) ============= Deep-cloning Javascript object
var objA = {
    "name": "colin"
}

// Normal method? Too long. See Stackoverflow for solution: http://stackoverflow.com/questions/4459928/how-to-deep-clone-in-javascript
var objB = _.cloneDeep(objA);
objB === objA // false


// 5) ============= Get Random Number between a range
// Get a random number between 15 and 20.

// Naive utility method
function getRandomNumber(min, max){
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

getRandomNumber(15, 20);

// Lodash
_.random(15, 20);

// 9) =======Selecting a random item from a list
var luckyDraw = ["Colin", "John", "James", "Lily", "Mary"];

function pickRandomPerson(luckyDraw){
    var index = Math.floor(Math.random() * (luckyDraw.length));
    return luckyDraw[index];
}

pickRandomPerson(luckyDraw); // John

// Lodash
_.sample(luckyDraw); // Colin


// 6) ============ Extending object
// Adding extend function to Object.prototype
Object.prototype.extend = function(obj) {
    for (var i in obj) {
        if (obj.hasOwnProperty(i)) {
            this[i] = obj[i];
        }
    }
};

var objA = {"name": "colin", "car": "suzuki"};
var objB = {"name": "james", "age": 17};

objA.extend(objB);
objA; // {"name": "james", "age": 17, "car": "suzuki"};

// Lodash
_.assign(objA, objB);

//The _.assign method can also accept multiple objects for extension.

//Extending multiple objects
var objA = {"name": "colin", "car": "suzuki"};
var objB = {"name": "james", "age": 17};
var objC = {"pet": "dog"};

// Lodash
_.assign(objA, objB, objC)
// {"name": "james", "car": "suzuki", "age": 17, "pet": "dog"}


// 7)=============== Removing properties from object
// Naive method: Remove an array of keys from object
Object.prototype.remove = function(arr) {
    var that = this;
    arr.forEach(function(key){
        delete(that[key]);
    });
};

var objA = {"name": "colin", "car": "suzuki", "age": 17};

objA.remove(['car', 'age']);
objA; // {"name": "colin"}

// Lodash
objA = _.omit(objA, ['car', 'age']); // {"name": "colin"}

//The naive method only considers an array parameter. We might also want to cater for a single string parameter for single key deletion or even accepting a comparator.

//More use-cases
var objA = {"name": "colin", "car": "suzuki", "age": 17};

// Lodash
objA = _.omit(objA, 'car'); // {"name": "colin", "age": 17};
objA = _.omit(objA, _.isNumber); // {"name": "colin"};