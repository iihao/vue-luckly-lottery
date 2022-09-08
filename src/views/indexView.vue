<template>
  <div id="building">
    <div>
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
              text
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
              <span> <el-input
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
          <span>中奖名单<el-button
            text
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
            :style="moveCss"
          >
            <span>{{ currentLucklyUser }}</span>
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
        :disabled="disabled"
        @click="startRoll"
      >
        {{ rollStatus }}
      </el-button>

      <el-button
        class="luckly-button"
        type="primary"
        @click="resetData"
      >
        数据重置
      </el-button>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import { usersData } from '../assets/data/data.js'
import { rollNum } from '@/utils/rollNum'
import setTimeEaseOut from '@/utils/setTimeoutRoll'
import { Edit,RefreshLeft } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
//import { ElMessage, ElMessageBox } from 'element-plus'


const refUsersData = ref(usersData) //定义获取文件数据
const getUsersData = ref() //定义获取浏览器存储的数据
const getRollNum = ref(0) //定义随机数
const isBegin = ref(false) //定义开始状态
const lucklyDogValue = ref() //定义抽中数据
const moveCss = ref()

const rollStatus=ref('开始抽奖')

const currentLucklyUser = ref()

const disabled = ref(false)

const dialogVisible = ref(false) //弹出对话框

const usersTextarea = ref('') //用户输入框双向绑定

const getLoaclItem = () => {
//读取存储
	getUsersData.value = JSON.parse(localStorage.getItem('userData')) || {'user':[]}
	lucklyDogValue.value = JSON.parse(localStorage.getItem('lucklyDogValue')) || {'lucklyUser':[]}
}
getLoaclItem()

usersTextarea.value = 
	getUsersData.value.user.map((item, index) => {
		return item.name
	})
		.join('|')

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
		// const ret = newUserData.user.filter(item => {
		// 	let newUser = usersData.user.map(val => val.name)
		// 	return newUser.indexOf(item.name) ==-1
		// }).name
		// usersData.user.push(ret)
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

const addUser = () => {
	
}
const clearLucklyUser = () => {
	lucklyDogValue.value = {'lucklyUser':[]}
	localStorage.setItem('lucklyDogValue', JSON.stringify(lucklyDogValue.value) ) 
	getUsersData.value = UpdateUserData()
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


//监听数据变化，更新存储
// watch(UpdateUserData, () => {
// 	return localStorage.setItem('userData',JSON.stringify(UpdateUserData()))
// }, { deep: true })



</script>
<style scoped>

#building{
    background-color: rgb(105, 215, 255);
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
    border-radius: 5px;
    min-height: 40px;
    height: 50px;
    background: rgb(174 234 255 / 83%);
    padding: 0.8rem 0.5rem !important;
    margin:0rem 1rem;
    font-size: 19px;
    text-align: center;
    font-weight: 500;
}
.grid-content {  
    border-radius: 5px;
    min-height: 400px;
    height: 500px;
    background: rgb(174 234 255 / 83%);
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
