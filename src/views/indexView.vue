<template>
  <div>
    <el-row
      :gutter="50"
      justify="center"
    >
      <el-col
        :span="6"
        class="grid-content"
      >
        <el-scrollbar> 
          <div class=" content-left">
            <el-card
              v-for="(item,index) in getUsersData.user"
              :key="index"
              class="card-userinfo"
            >
              <div class="cssMove">
                {{ item.name }}
              </div>
            </el-card>
          </div>
        </el-scrollbar>
      </el-col>

      <el-col
        :span="6"
        class="grid-content"
      >
        <div class="luckly-center">
          <span>{{ currentLucklyUser }}</span>
        </div>
      </el-col>

      <el-col
        :span="6"
        class="grid-content"
      >
        <el-scrollbar>
          <h1>中奖名单</h1>
          <div class=" content-left">
            <el-card
              v-for="(item,index) in lucklyDogValue.lucklyUser"
              :key="index"
              class="card-userinfo"
            >
              {{ item.name }}
            </el-card>
          </div>
        </el-scrollbar>
      </el-col>
    </el-row>
    <el-button
      class="luckly-button"
      type="primary"
      @click="startRoll"
    >
      开始抽奖
    </el-button>

    <el-button
      class="luckly-button"
      type="primary"
      @click="resetData"
    >
      数据重置
    </el-button>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import { usersData } from '../assets/data/data.js'
import {rollNum}  from '@/utils/rollNum'


const refUsersData = ref(usersData) //定义获取文件数据
const getUsersData = ref() //定义获取浏览器存储的数据
const getRollNum = ref(0) //定义随机数
const isBegin = ref(false) //定义开始状态
const lucklyDogValue = ref() //定义抽中数据

const currentLucklyUser = ref()


//读取存储
getUsersData.value = JSON.parse(localStorage.getItem('userData')) || {'user':[]}
lucklyDogValue.value = JSON.parse(localStorage.getItem('lucklyDogValue')) || {'lucklyUser':[]}



const startRoll =() => {
	if (!isBegin.value) {
		const userValue = getUsersData.value.user
		console.log(lucklyDogValue.value)
		//获取随机数
		getRollNum.value = rollNum(0, userValue.length-1)
		console.log(getRollNum.value)
		const lucklyDog = userValue[getRollNum.value]
		console.log(lucklyDog)
		if (lucklyDog) {
			currentLucklyUser.value=lucklyDog.name
			lucklyDogValue.value.lucklyUser.push(lucklyDog)
			localStorage.setItem('lucklyDogValue',JSON.stringify(lucklyDogValue.value))
			getUsersData.value = UpdateUserData()
			localStorage.setItem('userData',JSON.stringify(getUsersData.value))
		}
	} else {
		console.log('停止抽奖')
	}
}

//更新用户表
const UpdateUserData = () => {
	let newUserData = { user: [] } 
	const newData = getUsersData.value.user.filter((item) => {
		let idList = lucklyDogValue.value.lucklyUser.map(val => val.uId)
		return idList.indexOf(item.uId) ==-1
	})
	for (let i = 0; i < newData.length;i++){newUserData.user.push(newData[i])}
	console.log(newUserData)
	return  newUserData
}



const resetData = () => {
	lucklyDogValue.value = {'lucklyUser':[]}
	localStorage.setItem('lucklyDogValue', JSON.stringify(lucklyDogValue.value) )
	currentLucklyUser.value = ''
	getUsersData.value = refUsersData.value
	localStorage.setItem('userData', JSON.stringify(refUsersData.value))
}

//监听数据变化，更新存储
// watch(UpdateUserData, () => {
// 	return localStorage.setItem('userData',JSON.stringify(UpdateUserData()))
// }, { deep: true })



</script>
<style scoped>

.luckly-button{
	margin-top: 15px;
	height: 30px;
	width: 100px;
	display:flex;
	margin: 20px auto;

}
.grid-content {
    border-radius: 5px;
    min-height: 400px;
    height: 500px;
    background: #fee3e3;
    padding: 0.8rem 0.5rem;
    margin:0rem 1rem;
}
.content-left{
    display: flex;
    flex-wrap: wrap;
    justify-content: space-evenly;
}
.card-userinfo{
    width: 40%;
    margin: 0.5rem 0.3rem;
}
.luckly-center {
    display: flex;
    justify-content: center;
    align-content: stretch;
    height: 100%;
    align-items: center;
    font-size: 100px;
}
</style>
