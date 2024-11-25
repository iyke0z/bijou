<template>
  <div class="table-responsive">
    <div class="calculator-container">
      <div class="display-box row">
        <input type="text" readonly autofocus step="any" v-model="val" class="form-control col-6 whiteSpace" placeholder="0">
        <label class="col-6 mt-2 pt-3 bg-secondary text-light" >Change = {{ result }} </label>
      </div>
      <div class="row">
        <div class="col-12">
          <div class="numpad">
            <div class="row" v-for="row in rows" :key="row">
              <div class="col-4">
                <button class="btn btn-secondary text-light numHolder" @click="get_val(row[0])">{{row[0]}}</button>
              </div>
              <div class="col-4">
                <button class="btn btn-secondary text-light numHolder" @click="get_val(row[1])">{{row[1]}}</button>
              </div>
              <div class="col-4">
                <button class="btn btn-secondary text-light numHolder" @click="get_val(row[2])">{{row[2]}}</button>
              </div>
            </div>
            <div class="row">
              <div class="col-4">
                <button class="btn btn-secondary text-light numHolder" @click="get_val(0)">0</button>
              </div>
              <div class="col-4">
                <button class="btn btn-secondary text-light numHolder" @click="get_val('del')">del</button>
              </div>
            </div>
          </div>
        </div>
        <!-- <div class="col-3">
          <div class="symbols">
            <button @click="getSymbol('+')" class="btn symbol">+</button>
            <button @click="getSymbol('*')" class="btn symbol">-</button>
            <button @click="getSymbol('/')" class="btn symbol">/</button>
            <button @click="getSymbol('*')" class="btn symbol">*</button>
          </div>
        </div> -->
      </div>
    </div>
  </div>
</template>
<script>
  export default{
    props:{total:0},
    data() {
      return {
        rows:[
          [7,8,9],
          [4,5,6],
          [1,2,3],
        ],
        val:"",
        symbol:null,
        result:0,
        value:[]
      }
    },
    methods: {
      get_val(val){
        if(val == 'del'){
          this.val = ""
          this.value = []
        }else{
          this.value.push(val)
          this.val = this.value.toString()
          this.val = this.val.replace(/,/g,'')
          console.log(this.total)
          this.result = +this.val - this.total
          this.result = Math.ceil(this.result)
        }
      },
      calc(){
        //
      }
    },

  }
</script>
<style scoped>
  .calculator-container{
    border: 1px solid white;
    border-radius: 20px;
    height: 450px;
    margin-top: 2%;
    width: 90%;
    margin-right: 20%;
    background-color: black;
    position: absolute;
  }

  .display-box{
    position: relative;
    border: 1px solid white;
    border-bottom-left-radius: 15px;
    border-bottom-right-radius: 15px;
    margin-top: 2%;
    height: 80px;
    width: 95%;
    margin-left: auto;
    margin-right: auto;
    background-color: white;
  }

  .whiteSpace{
    position:relative;
    height: 100%;
    border: none;
    border-bottom-left-radius: 15px;
    border-bottom-right-radius: 15px;
  }

  .numpad{
    position:relative;
    border: 0.5px solid white;
    height: 300px;
    width: 90%;
    margin-left: 2%;
    margin-right: auto;
    margin-top:25px;
  }

  .numHolder{
    position: relative;
    border: 1px solid white;
    width: 90px;
    height: 50px;
    font-size: large;
  }

  .numHolder:hover{
    background-color: azure;
  }
  .numHolder:first-child{
    margin-left: 3.5%;
  }
  .numHolder:last-child{
    margin-right: 3%;
  }
  .symbols{
    border: 1px solid white;
    padding: relative;
    width: 85%;
    margin-top:25px;
    height: 300px;
    padding-left: 3%;
  }

  .symbol{
    height: 30px;
    font-size: larger;
    padding: 2px;
    width:90%;
    color:black;
    background-color:white;
    border: 3px solid rgb(128, 87, 87);
  }
</style>
