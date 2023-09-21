const person = {
   name: 'John Doe',
   getName: function () {
      console.log(this.name);
   }
};

const getName = person.getName;
console.log(person.getName());