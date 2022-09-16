<template>
  <div id="building">
    <!-- 左侧抽奖信息菜单 -->
    <div class="menuList">
      <ul class="menuList-menu">
        <li
          v-for="item in getLevelInfo"
          :key="item.id"
          :class="currentLevel == item.id-1 ? 'current' :''"
          @click="changeLevel(item)"
        >
          <div class="tip">
            {{ item.name }}
          </div>
          <div class="id">
            {{ item.id }}
          </div>
        </li>
      </ul>
    </div>
    <!-- 奖品信息 -->
    <div
      v-if="disabled==false"
      class="prizeInfo"
    >
      <div class="title">
        {{ getLevelInfo[currentLevel].name }}
      </div>
      <div class="img">
        <img
          :id="'img' + getLevelInfo[currentLevel].id"
          :src="require('../assets/img/' + getLevelInfo[currentLevel].img)"
        >
      </div>
      <div class="desc">
        {{ getLevelInfo[currentLevel].prize }}
      </div>

      <!-- 临时增加中奖数据 -->
      <div class=" content-left">
        <el-card
          v-for="(item,index) in lucklyDogValue.lucklyUser"
          :id="index"
          :key="item.uId"
          class="card-userinfo"
        >
          {{ item.name }}
        </el-card>
      </div>    
    </div>
    <div v-else>
      <el-row
        :gutter="50"
        class="top-row"
        justify="center"
      >
        <el-col
          :span="6"
          class="grid-top"
        >
          <span>抽奖名单 
            <el-button
              :icon="Edit"
              circle
              @click="dialogShow"
            />

            <el-dialog
              v-model="dialogVisible"
              title="编辑用户"
              width="40%"
              draggable
            >
              <span> <p style="color:darkgray">请直接填入需要抽奖的人员名称 并用 | 分割</p>
                <el-input
                  v-model="usersTextarea" 
                  :rows="10"
                  type="textarea"
                  placeholder="Please input"
                /></span>
              <template #footer>
                <span class="dialog-footer">
                  <el-button @click="dialogShow">取消</el-button>
                  <el-button
                    type="primary"
                    @click="saveUserTextarea"
                  >保存</el-button>
                </span>
              </template>
            </el-dialog>
            
          </span>
        </el-col>
        <el-col
          :span="6"
          class="grid-top"
        >
          <span>抽奖</span>
        </el-col>
        <el-col
          :span="6"
          class="grid-top"
        >
          <span>中奖名单 <el-button
            :icon="RefreshLeft"
            circle
            @click="clearLucklyUser"
          /></span>
        </el-col>
      </el-row>
      <el-row
        :gutter="50"
        class="main-row"
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
          <div
            class="luckly-center"
          >
            <el-card class="card-content">
              <span>{{ currentLucklyUser }}</span>
            </el-card>
          </div>
        </el-col>

        <el-col
          :span="6"
          class="grid-content"
        >
          <el-scrollbar>
            <div class=" content-left">
              <el-card
                v-for="(item,index) in lucklyDogValue.lucklyUser"
                :id="index"
                :key="item.uId"
                class="card-userinfo"
              >
                {{ item.name }}
              </el-card>
            </div>
          </el-scrollbar>
        </el-col>
      </el-row>
    </div>
    <!-- 开始抽奖按钮 -->
    <el-button
      class="luckly-button"
      type="primary"
      :disabled="disabled"
      @click="startRoll"
    >
      {{ rollStatus }}
    </el-button>

    <!-- 配置信息 -->
    <div class="setting">
      <text
        class="reSet"
        @click="resetData"
      >
        数据重置
      </text>
    </div>
  </div>
</template>
<script setup>

import { ref,onMounted } from 'vue'
import { usersData } from '../assets/data/data.js'
import { rollNum } from '@/utils/rollNum'
import setTimeEaseOut from '@/utils/setTimeoutRoll'
import { Edit,RefreshLeft } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
//import { ElMessage, ElMessageBox } from 'element-plus'


const refUsersData = ref(usersData) //定义获取文件数据
const getLevelInfo = ref(usersData.levelInfo)
const getUsersData = ref() //定义获取浏览器存储的数据
const getRollNum = ref(0) //定义随机数
const isBegin = ref(false) //定义开始状态
const lucklyDogValue = ref() //定义抽中数据
const rollStatus = ref('开始抽奖') //抽奖按钮

const currentLevel = ref(3) //当前抽奖level


const currentLucklyUser = ref() //当前中间用户

const disabled = ref(false) //输入框状态

const dialogVisible = ref(false) //弹出对话框

const usersTextarea = ref('') //用户输入框双向绑定

const getLoaclItem = () => {
//读取存储
	getUsersData.value = JSON.parse(localStorage.getItem('userData')) || refUsersData.value
	lucklyDogValue.value = JSON.parse(localStorage.getItem('lucklyDogValue')) || {'lucklyUser':[]}
}
getLoaclItem()

usersTextarea.value = 
	getUsersData.value.user.map((item, index) => {
		return item.name
	})
		.join('|')

const changeLevel = (e) => {
	currentLevel.value = e.id-1
}

//保存前台填入的用户
const saveUserTextarea = () => {
	let newUserData = { user: [] } 
	const splitValue = usersTextarea.value.split('|')
	console.log(splitValue)
	for (let i = 0; i < splitValue.length; i++){
		const result = {}
		result.uId = i + 1
		result.name =  splitValue[i]
		newUserData.user.push(result)
	}
	if (newUserData.user) {
		localStorage.setItem('userData', JSON.stringify(newUserData))//修改存储
		localStorage.setItem('usersTextarea', JSON.stringify(newUserData))//新增存储
		getLoaclItem() //重新读取存储
	} else {
		ElMessage('数据为空，保存失败！')
	}
	console.log(newUserData.user)
	dialogShow()
}

const dialogShow = () => {
	dialogVisible.value = !dialogVisible.value
	console.log(dialogVisible.value)
}



const startRoll =() => {
	if (!isBegin.value) {
		startScroll()
		setTimeout(() => {
			const userValue = getUsersData.value.user
			console.log(lucklyDogValue.value)
			//获取随机数
			getRollNum.value = rollNum(0, userValue.length - 1)
			console.log(getRollNum.value)
			const lucklyDog = userValue[getRollNum.value]
			console.log(lucklyDog)
			if (lucklyDog) {
				currentLucklyUser.value = lucklyDog.name
				lucklyDogValue.value.lucklyUser.push(lucklyDog)
				localStorage.setItem('lucklyDogValue', JSON.stringify(lucklyDogValue.value))
				getUsersData.value = UpdateUserData()
				localStorage.setItem('userData', JSON.stringify(getUsersData.value))
			}
		}, 5000)
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
	//console.log(newUserData)
	return  newUserData
}

//清除中奖数据
const clearLucklyUser = () => {
	lucklyDogValue.value = {'lucklyUser':[]}
	localStorage.setItem('lucklyDogValue', JSON.stringify(lucklyDogValue.value) ) 
	getUsersData.value = JSON.parse(localStorage.getItem('usersTextarea'))||refUsersData.value
}

//数据重置(初始化)
const resetData = () => {
	lucklyDogValue.value = {'lucklyUser':[]}
	localStorage.setItem('lucklyDogValue', JSON.stringify(lucklyDogValue.value) )
	currentLucklyUser.value = ''
	getUsersData.value = refUsersData.value
	localStorage.setItem('userData', JSON.stringify(refUsersData.value))
}


const startScroll = async () => {
	rollStatus.value='抽奖中...'
	disabled.value = true
	await setTimeEaseOut(
		(time) => {
			const userValueRoll = getUsersData.value.user
			const roll = userValueRoll[rollNum(0, userValueRoll.length-1)] 
			currentLucklyUser.value = roll.name
			console.log(roll.name)
		},
		{ timeout: 5000, startSpeed: 100, endSpeed: 500 }
	).then((time) => console.log(time))
	rollStatus.value = '开始抽奖'
	disabled.value = false
}
onMounted(() => {
	getLevelInfo.value = usersData.levelInfo
	console.log(usersData.levelInfo)
	console.log(getLevelInfo.value)
})


</script>
<style scoped>

#building{
    background-color: rgb(105, 215, 255);
    background: url('../assets/img/bg.jpg');
    width:100%;
    height:100%;
    position:fixed;
    background-size:100% 100%;
}
.top-row{
    margin-top:30px;
}
.main-row{
    margin-top: 1px;
}
.luckly-button{
	margin-top: 15px;
	height: 30px;
	width: 100px;
	display:flex;
	margin: 20px auto;

}
.grid-top{
    border-radius: 5px 5px 0 0;
    color:aliceblue;
    min-height: 40px;
    height: 50px;
    background: rgb(174 234 255 / 15%);
    padding: 0.8rem 0.5rem !important;
    margin:0rem 1rem;
    font-size: 19px;
    text-align: center;
    font-weight: 500;
}
.grid-content {  
    border-radius:0 0 5px 5px;
    min-height: 400px;
    height: 500px;
    background: rgb(174 234 255 / 15%);
    padding: 0.8rem 0.5rem !important;
    margin:0rem 1rem;
}
.content-left{
    display: flex;
    flex-wrap: wrap;
    justify-content: space-evenly;
}
.card-userinfo{
    width: 26%;
    margin: 0.5rem 0.3rem;
    text-align: center;
}
.luckly-center {
    display: flex;
    justify-content: center;
    align-content: stretch;
    height: 100%;
    align-items: center;
    font-size: 100px;
}
.card-content{
    color: #fff;
    background: #fff0;
    height: 400px;
    width: 70%;
    display: flex;
    align-items: center;
    writing-mode: vertical-rl;
    justify-content: center;
    text-orientation: upright;
    border: 2px saddlebrown;
    box-shadow: 0px 0px 9px 4px #333;
    font-weight: 400;
}
.menuList {
    position: absolute;
    width: 50px;
    left: 30px;
    top: 45%;
    transform: translate(-50%, -50%);
    z-index: 10;
}
 .menuList-menu{
    width: 100%;
    margin-top: 100px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    margin: 0;
    padding: 0;
}
.tip {
    width: 50%;
    height: 100%;
    font-size: 16px;
    transform: scale(0.5);
    position: relative;
    line-height: 1;
    vertical-align: middle;
}
.id {
    width: 50%;
}
.menuList-menu li {
    cursor: pointer;
    background-color: #383838;
    color: #777777;
    width: 50px;
    height: 50px;
    list-style: none;
    display: flex;
    align-content: center;
    justify-content: center;
    border-radius: 5px;
    margin-bottom: 2px;
    align-items: center;
}
li.current{
    color: #2d4981;
}

.title {
    font-size: 3.5em;
    font-weight: 900;
    color: #fa4238;
    padding-left: 0.3em;
    letter-spacing: 0.3em;
    text-align: center;
}
.desc {
    color: white;
    margin-bottom: 2%;
    font-size: 2em;
}
.img {
    margin:2% 0;
}
.img img{
    height: 250px;
    width: auto;
    object-fit: cover;
    border-radius: 20px;
}
.prizeInfo{
    display: flex;
    flex-direction: column;
    align-content: center;
    justify-content: center;
    align-items: center;
    margin-top: 4%;
    min-height: 70%;
}
.setting {
    position: absolute;
    bottom: 0px;
    /* background: #fff; */
}
.reSet{
    margin:5px;
}
</style>
