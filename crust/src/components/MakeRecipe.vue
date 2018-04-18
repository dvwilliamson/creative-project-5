<template>
    <div class="recipeFeed main-section">
        <div>
            <v-dialog/>
            <form v-on:submit.prevent="crust" class="recipeForm">
                <label>Recipe</label>
                <input v-model="name" placeholder="Recipe Name">
                <label>Category</label>
                <select v-model="category" name="category">
                    <option value="appetizer">Appetizer</option>
                    <option value="breakfast">Breakfast</option>
                    <option value="lunch">Lunch</option>
                    <option value="dinner">Dinner</option>
                    <option value="snack">Snack</option>
                    <option value="dessert">Dessert</option>
                </select>
                <br/><br/>
                <label>&nbsp;Image</label>
                <input v-model="pic_url" placeholder="Image url">
                <label>Total Time:</label>
                <select v-model="hours" name="hours">
                    <option value="0">0</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="7">7</option>
                    <option value="8">8</option>
                    <option value="9">9</option>
                    <option value="10">10</option>
                </select>
                <select v-model="minutes" name="minutes">
                    <option value="0">0</option>
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="15">15</option>
                    <option value="20">20</option>
                    <option value="30">30</option>
                    <option value="40">40</option>
                    <option value="45">45</option>
                    <option value="50">50</option>
                </select>
                <br/></br/>

                <!--
                <div v-for="item in ingredients">
                    <li><label>{{item.name}} | {{item.amount}} {{item.units}}</label></li>
                </div> -->
                <label>Ingredients</label><br/>
                <table>
                    <tr v-for="item in ingredients">
                        <td>&nbsp;&nbsp;</td>
                        <td class="descrlabel"><label>{{item.name}}</label></td>
                        <td><label> | {{item.amount}} {{item.units}}</label></td>
                        <td>&nbsp;&nbsp;</td>
                        <td><label v-on:click.prevent="removeIngredient(item)">[remove]</label></td>
                    </tr>
                </table>
                <br/>
                <label>&nbsp;&nbsp;</label>
                <input class="ingred" v-model="ingred_name" placeholder="Name (ex. carrots)">
                <input class="ingred" v-model="ingred_amount" placeholder="Amount (ex. 2)">
                <input class="ingred" v-model="ingred_units" placeholder="Unit (ex. cups)">
                <a v-on:click.prevent="addIngredient" class="primary">Add</a>

                <br/><br/>
                <label>Directions</label><br/>
                <table>
                    <tr v-for="item in directions">
                        <td>&nbsp;&nbsp;</td>
                        <td class="descrlabel"><label>Step {{directions.indexOf(item) + 1}}.</label></td>
                        <td class="descrlabel"><label>{{item.body}}</label></td>
                        <td>&nbsp;&nbsp;</td>
                        <td class="descrlabel"><label v-on:click.prevent="removeStep(item)">[remove]</label></td>
                    </tr>
                </table>
                <br/>
                <label>&nbsp;&nbsp;</label>
                <input class="ingred long" v-model="dirDescr" placeholder="Explanation of step">
                <a v-on:click.prevent="addStep" class="primary">Add</a>

                <br/><br/>
                <label>Description</label><br/>
                <textarea rows="6" cols="70" v-model="description" placeholder="Enter a description of your delicious dish here."></textarea>
                <div class="buttonWrap">
                    <button class="primary" type="submit">CRUST!</button>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
 export default {
   name: 'MakeRecipe',
   data () {
     return {
       name: '',
       category: 'dinner',
       hours: '0',
       minutes: '0',
       description: '',
       ingredients: [],
       directions: [],
       pic_url: '',
       ingred_name: '',
       ingred_amount: '',
       ingred_units: '',
       dirDescr: '',
     }
   },
   created: function() {
        if (!this.$store.getters.loggedIn)
            this.$router.push('/');
   },
   methods: {
     crust: function() {
        if (this.name === '' ||
            this.category === '' ||
            this.description === '' ||
            (this.hours === '' && this.minutes === '')) {
                this.showRecipeMessage();
                return;
        }

        let dir = this.directions.map(obj => {
            var rObj = {};
            rObj["step"] = this.directions.indexOf(obj);
            rObj["description"] = obj.text;
            return rObj;
        });
       this.$store.dispatch('addRecipe',{
         name: this.name,
         category: this.category,
         permissions: "public",
         hours: this.hours,
         minutes: this.minutes,
         ingredients: this.ingredients,
         directions: this.directions,
         description: this.description,
         pic_url: this.pic_url
       }).then(recipe => {
            this.$router.push('/');
       });
     },
     addIngredient: function() {
        this.ingredients.push({
            name: this.ingred_name,
            amount: this.ingred_amount,
            units: this.ingred_units
        });
        this.ingred_name = '';
        this.ingred_amount = '';
        this.ingred_units = '';
     },
     removeIngredient: function(item){
        let i = this.ingredients.indexOf(item);
        if (i > -1) {
            this.ingredients.splice(i, 1);
        }
     },
     addStep: function() {
        this.directions.push({ body: this.dirDescr });
        this.dirDescr = '';
     },
     removeStep: function(item){
        let i = this.directions.indexOf(item);
        if (i > -1) {
            this.directions.splice(i, 1);
        }
     },
     showRecipeMessage() {
        this.$modal.show('dialog', {
          title: 'Incomplete Recipe',
          text: 'Please fill in at least the name, time, and description of your recipe.',
          buttons: [
            {
              title: 'Close'
            }
         ]
        })
     }
   }
 }
</script>

<style scoped>

input.long {
    width: 500px;
}

.main-section {
    max-width: 1000px;
    margin-left: auto;
    margin-right: auto;
}

.descrlabel {
    min-width: 80px;
    vertical-align: top;
}

.ingred {
    padding: 0px;
}

.recipeFeed {
    width: 600px;
}

.recipeForm {
    background: #eee;
    padding: 10px;
    margin-bottom: 10px;
}

 textarea {
     width: 100%;
     height: 5em;
     padding: 2px;
     margin-bottom: 5px;
     resize: none;
     box-sizing: border-box;
 }

.buttonWrap {
    width: 100%;
    display: flex;
}

button {
    margin-left: auto;
    height: 2em;
    font-size: 0.9em;
}

</style>