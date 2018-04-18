<template>
    <div class="recipeFeed main-section">
        <div>
            <v-dialog/>
            <div class="recipeForm">
                <label>{{recipe.name}}</label><label> | {{category}}</label>
                <br/><br/>
                <img v-bind:src="recipe.pic_url" alt="" class="wideImg"/>
                <br/><br/>
                <label>Total Time: {{timeString}}</label>
                <br/><br/>
                <label>Ingredients</label><br/>
                <table>
                    <tr v-for="item in ingredients">
                        <td>&nbsp;&nbsp;</td>
                        <td class="descrlabel"><label>{{item.name}}</label></td>
                        <td><label> |&nbsp;&nbsp;{{item.amount}} {{item.units}}</label></td>
                    </tr>
                </table>
                <br/>
                <label>Directions</label><br/>
                <table>
                    <tr v-for="item in directions">
                        <td>&nbsp;&nbsp;</td>
                        <td class="descrlabel"><label>Step {{directions.indexOf(item) + 1}}.</label></td>
                        <td class="descrlabel"><label>{{item.body}}</label></td>
                    </tr>
                </table>
                <br/>
                <label>Description</label><br/>
                <label style="margin-left: 35px;">{{recipe.description}}</label>
                <div class="buttonWrap">
                    <button class="primary" v-on:click="deleteConfirm">Delete</button>
                    <button class="primary" v-on:click="editClick" style="margin-left: 5px;">Edit</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
 export default {
   name: 'ViewRecipe',
   data () {
     return {
        category: '',
        timeString: '',
        ingredients: [],
        directions: [],

     }
   },
   created: function() {
    console.log("ENTERING HERE");
        if (!this.$store.getters.loggedIn)
            this.$router.push('/');
        console.log("ENTERING HERE 2");
        let tempId = parseInt(this.$route.params.id)
        let tempObj = {id:tempId};
        console.log(tempObj);
        this.$store.dispatch('getRecipe', tempObj).then( temp => {
            console.log("ENTERING HERE 3 ");
            console.log(temp);
        });
   }, 
   computed: {
        recipe: function(){
            let temp = this.$store.getters.recipe;
            console.log(temp);
            let hours = temp.hours;
            let minutes = temp.minutes;
            let ingreds = temp.ingredients;
            let dirs = temp.directions;

            this.category = this.properCase(temp.category);
            this.ingredients = JSON.parse(ingreds);
            this.directions = JSON.parse(dirs);

            let hrSuffix = hours > 1 ? " hours " : " hour ";
            let minSuffix = minutes > 1 ? " minutes " : " minute";
            if (hours > 0){
                if (minutes > 0){
                    this.timeString = hours + hrSuffix + minutes + minSuffix;
                } else {
                    this.timeString = hours + hrSuffix;
                }
            } else { this.timeString = minutes + minSuffix; }

            return temp;
        }
   },
   methods: {
    initPage(temp){
        let hours = temp.hours;
        let minutes = temp.minutes;
        let ingreds = temp.ingredients;
        let dirs = temp.directions;

        this.category = this.properCase(temp.category);

        this.ingredients = JSON.parse(ingreds);
        this.directions = JSON.parse(dirs);


        let hrSuffix = hours > 1 ? " hours " : " hour ";
        let minSuffix = minutes > 1 ? " minutes " : " minute";
        if (hours > 0){
            if (minutes > 0){
                this.timeString = hours + hrSuffix + minutes + minSuffix;
            } else {
                this.timeString = hours + hrSuffix;
            }
        } else { this.timeString = minutes + minSuffix; }

        return temp;
    },
     crust: function() {
        if (this.name === '' ||
            this.category === '' ||
            this.description === '' ||
            (this.hours === '' && this.minutes === '')) {
                this.showRecipeMessage();
                return;
        }
        return;

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
         directions: dir,
         description: this.description,
         pic_url: this.pic_url
       }).then(recipe => {
            this.$router.push('/');
       });
     },
     properCase: function(str){
        if (str === undefined) return "";
        return str.charAt(0).toUpperCase() + str.slice(1);
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
     deleteConfirm(){
        this.$modal.show('dialog', {
          title: 'Confirm',
          text: 'Are you sure you would like to edit this Recipe. This action is not reversible.',
          buttons: [
            {
              title: 'Delete',
              handler: () => { 
                this.$store.dispatch('deleteRecipe');
                this.$router.push('/');
              }
            }, {
              title: 'Close'
            }
         ]
        });
    },
    editClick(){
        this.$router.push('/edit/' + this.$store.getters.recipe.id);
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

.wideImg{
    width: 100%;
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