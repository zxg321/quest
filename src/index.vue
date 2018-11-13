<template>
  <div class="wrapper">
    <wxc-loading :show="isShow" type="trip"></wxc-loading>
    <wxc-tab-bar :tab-titles="tabTitles" :tab-styles="tabStyles" title-type="iconFont" @wxcTabBarCurrentTabSelected="wxcTabBarCurrentTabSelected">
    <div class="item-container" :style="contentStyle">
      <title title="知识问答"></title>
      <scroller v-show="isShow1" class="scroller">
        <list><cell v-for="(v,index) in menuData">
        <div class="category">
          <text class="category-text">{{v.title}}</text>
        </div>
        <image :src="Img_Server + v.image" ref="poster" class="questImage"></image>
        <text class="text-container">{{v.content}}</text>
        <wxc-button text=" 开 始 " @wxcButtonClicked="wxcButtonClicked(v.id)" class="button" :disabled="v.disabled"></wxc-button>
        </cell></list>
      </scroller>
      <scroller v-show="isShow2" class="scroller">
        <div class="wtprogress">
          <text class="progress-text left">答题进度</text>
          <wxc-progress :value="progress_value" :bar-width=500></wxc-progress>
          <text class="progress-text right">{{progress_value}}%</text>
        </div>
        <div class="wtprogress">
          <text class="progress-text left">答题时间</text>
          <text class="progress-text">{{progress_time}} 秒</text>
          <wxc-button text="提交答案" @wxcButtonClicked="wxcButtonClick3" v-show="isShow3" size="medium"></wxc-button>
        </div>
          <wxc-ep-slider :slider-id="sliderId"
                   :card-length='cardLength'
                   :card-s="cardSize" ref="wxc-ep-slider"
                   @wxcEpSliderCurrentIndexSelected="wxcEpSliderCurrentIndexSelected">

          <!--自动生成demo-->
          <div v-for="(v,index) in listData"
              :key="index"
              :slot="`card${index}_${sliderId}`"
              :class="['slider',`slider${index%4}`]">
            <div class="category">
              <text class="category-text">第 {{index + 1}} 题：{{v.q_content}}</text>
            </div>
            <wxc-radio :list="v.list" @wxcRadioListChecked="wxcRadioListChecked"></wxc-radio>
          </div>
        </wxc-ep-slider>
      </scroller>
    </div>
    <!-- 排名页面内容-->
    <div class="item-container" :style="contentStyle">
      <title title="排名榜"></title>
      <wxc-tab-page ref="wxc-tab-page" :tab-styles="tabStylesPage" :tab-titles="UserPaiMing.title" title-type="text" @wxcTabPageCurrentTabSelected="wxcTabPageCurrentTabSelected">
        
        <list v-for="(v,index) in UserPaiMing.users" :key="index">
          <scroller class="scroller">
          <cell class="border-cell"></cell>
          <cell v-for="(demo,key) in v" class="cell" :key="key">
            <wxc-pan-item >
            <div class="wtprogress">
              <text> 第 {{key+1}} 名 </text>
              <div class="user-container">
              <div class="useravatar"><image class="useravatar" :src="demo.avatar"></image></div>
              <text>{{demo.name}}</text></div>
              <div>
                <text>分数：{{demo.u_value}}</text>
                <text>时间：{{demo.u_time}}</text>
                <text class="usertime">{{demo.updated_at}}</text>
              </div>
            </div>
            </wxc-pan-item>
          </cell></scroller>
        </list>
      </wxc-tab-page>


    </div>
    <!-- 个人信息页面内容-->
    <div class="item-container" :style="contentStyle">
      <title title="个人信息"></title>
      <div class="useravatar"><image class="useravatar" :src="UserInfo.user.avatar"></image></div>
      <text>{{UserInfo.user.name}}</text>
      <list class="item-container" :style="{ height: (deviceHeight - tabStyles.height) + 'px' }">
          <cell v-for="(v,index) in UserInfo.title"
              :key="index"><cell class="border-cell"></cell>
              <text class="title">{{v.title}}</text>
          <div class="content" v-if="v.user">
            
            <text>我的排名：第 {{v.user.paiming}} 名</text>
            <text>最好成绩： {{v.user.u_value}} 分</text>
            <text>成绩时间： {{v.user.u_time}} 秒</text>
            <text>答题次数： {{v.user.count}} 次</text>
          </div>
          <div class="content" v-else>
            
            <text>暂无排名</text>
          </div>  
          </cell>
      </list>
    </div>
    
    </wxc-tab-bar>
    <wxc-result :type="errortype" :show="errorshow" padding-top="232" @wxcResultButtonClicked="wxcResultButtonClicked"></wxc-result>
    <wxc-mask height="800"
              width="702"
              border-radius="0"
              duration="200"
              mask-bg-color="#FFFFFF"
              :has-animation="true"
              :has-overlay="true"
              :show-close="false"
              :show="isShow4"
              @wxcMaskSetHidden="wxcMaskSetHidden">
      <div class="content">
        <div class="demo-title">
          <text class="title">提示</text>
        </div>
        <text class="content-text">您的知识问答已经成功提交了。</text>
      </div>
    </wxc-mask>
  </div>
</template>

<script>
import md5 from 'js-md5'
import { WxcMinibar, WxcTabBar, Utils, WxcLoading, WxcButton, WxcEpSlider, WxcProgress, WxcResult, WxcRadio, WxcMask, WxcTabPage, WxcPanItem } from 'weex-ui'
import Config from './config'
import Title from './_mods/title.vue'
var stream = weex.requireModule('stream')
var modal = weex.requireModule('modal')
export default {
  name: 'App',
  components: {
    Title, WxcMinibar, WxcTabBar, Utils, WxcLoading, WxcButton, WxcEpSlider, WxcProgress, WxcResult, WxcRadio, WxcMask, WxcTabPage, WxcPanItem
  },
  data () {
    return {
      token: Config.MyToken,
      menuid: 1,
      myquest: 0, // 题目编号
      errorshow: false,
      errortype: 'noNetwork',
      isShow: true,
      isShow1: false,
      isShow2: false,
      isShow3: false,
      isShow4: false,
      Config:Config,
      tabTitles: Config.tabIconFontTitles,
      tabStyles: Config.tabIconFontStyles,
      tabStylesPage: Config.tabStylesPage,
      contentStyle: 'justify-content: flex-start;',
      title: Config.App_Title,
      App_Server: Config.App_Server,
      Img_Server: Config.Img_Server,
      menuData: null,
      listData: null,
      progress_value: 0,
      progress_time: -1,
      timeOut: null,

      sliderId: 1,
      cardLength: 5,
      cardSize: {
        width: 700,
        height: 1000,
        spacing: 0,
        scale: 0.8
      },
      deviceHeight:weex.config.env.deviceHeight,
      SelectMenu: 0,
      SelectPage: 0,

      UserPaiMing: {},
      UserInfo: {"error": 0, "user": {"id": 0, "name": "无资料", "avatar": "http:\/\/113.204.36.164:8081\/upload\/images\/user.jpg"}, "title": [{"id": 1, "title": "测试问答", "user": {"name": "无资料", "user_id": 0, "u_value": 0, "u_time": 0, "updated_at": 0, "p": 0, "paiming": 0}}]}
    }
  },
  methods: {
    is_load_info(){
      if(this.isShow){
        modal.toast({
          'message': '读取读取中，请稍等...',
          'duration': 1
        })
      }
      return this.isShow
    },
    wxcTabPageCurrentTabSelected (e) {},
    wxcMaskSetHidden (e) { this.isShow4 = false },
    wxcButtonClick3 (e) {
      if(this.is_load_info())return ;
      let me = this
      clearTimeout(this.timeOut)
      let myValue
      for (let index = 0; index < this.cardLength; index++) {
        const element = this.listData[index].SelectItem
        if (myValue == null) {
          myValue = element
        } else {
          myValue += ',' + element
        }
      }
      let myurl = 's=' + myValue + '&t=' + this.progress_time + '&token=' + this.token
      myurl = myurl + '&c=' + md5(myurl)
      console.log('element', myValue, 'progress_time', this.progress_time, 'myurl', myurl)
      var SET_QUEST_JSONP = Config.App_Server + 'api/quest?type=set&mid=' + this.menuid + '&id=' + this.myquest + '&' + myurl + '&token=' + this.token
      this.isShow = true
      stream.fetch({
        method: 'GET',
        url: SET_QUEST_JSONP,
        type: 'jsonp'
      }, function (ret) {
        if (!ret.ok) {
          me.isShow = false
          me.errorshow = true
        } else {
          if (ret.data.error == 1) {
            modal.alert({
              'message': ret.data.msg,
              'duration': 3
            })
          } else {
            me.progress_time = -1
            me.isShow = false
            me.isShow1 = true
            me.isShow2 = false
            me.isShow3 = false
            me.isShow4 = true
          }
        }
      }, function (response) {
        me.errorshow = true
        me.isShow = false
      })
    },
    runtime () {
      let me = this
      this.progress_time++
      this.timeOut = setTimeout(() => {
        me.runtime()
      }, 1000)
    },
    gotoprogress () {
      let myNum = 0
      for (let index = 0; index < this.cardLength; index++) {
        const element = this.listData[index].SelectItem
        if (element == undefined || element == null) {

        } else {
          myNum++
        }
      }
      this.progress_value = 100 * myNum / this.cardLength
      if (this.progress_value == 100) {
        this.isShow3 = true
      }
    },
    wxcRadioListChecked (e) {
      var me = this
      if(this.isShow)return ;//禁止快速点击出错误
      let SelectItem=this.listData[this.SelectPage].SelectItem
      if(SelectItem==e.value)return ;//重复的点击相同项目不步进
      this.isShow = true
      this.listData[this.SelectPage].SelectItem = e.value
      if (this.SelectPage < (this.cardLength - 1)) this.$refs['wxc-ep-slider'].manualSetPage(this.SelectPage + 1)
      this.gotoprogress()
      setTimeout(() => {//解决微信web不明原因的提交两次问题
        me.isShow = false
      }, 300)
      
    },
    wxcResultButtonClicked (e) {
      // this.customSet={errorPage: { button: null, desc: '可以减少筛选内容试试', content: '抱歉主人，没有找到合适条件的推荐' }}

      // e.type即错误页面类型，可以在这里做对应操作
      modal.toast({
        'message': '请重新微信扫码进入',
        'duration': 1
      })
    },
    minibarLeftButtonClick () {
    },
    minibarRightButtonClick () {
    },
    wxcTabBarCurrentTabSelected (e) { // 下面菜单栏切换
      if(this.is_load_info())return ;
      this.SelectMenu = e.page
      console.log('SelectMenu=' + this.SelectMenu)
      var me = this
      let GET_INFO_JSONP
      if (this.SelectMenu == 1) { // 排名榜
        GET_INFO_JSONP = Config.App_Server + 'api/quest?type=pai_ming&token=' + this.token
      } else if (this.SelectMenu == 2) { // 用户信息
        GET_INFO_JSONP = Config.App_Server + 'api/quest?type=user&token=' + this.token
      } else {
        return
      }
      this.isShow = true
      stream.fetch({
        method: 'GET',
        url: GET_INFO_JSONP,
        type: 'jsonp'
      }, function (ret) {
        if (!ret.ok) {
          me.isShow = false
          me.errorshow = true
        } else {
          me.isShow = false
          if (ret.data.error == 1) {
            modal.alert({
              'message': ret.data.msg,
              'duration': 3
            })
            return
          }
          if (me.SelectMenu == 1) { // 排名榜
            me.UserPaiMing = ret.data
          } else if (me.SelectMenu == 2) { // 用户信息
            me.UserInfo = ret.data
          }
        }
      }, function (response) {
        me.errorshow = true
        me.isShow = false
      })
    },
    wxcEpSliderCurrentIndexSelected (e) {//答题手动翻页
      this.SelectPage = e.currentIndex
      console.log('SelectPage=' + this.SelectPage)
    },
    wxcButtonClicked (id) {//读取题目展示
      if(this.is_load_info())return ;
      var me = this
      for (let index = 0; index < this.menuData.length; index++) {
        if (id == this.menuData[index].id) {
          if (this.menuData[index].disabled == true) {
            modal.toast({
              'message': '暂时不能开始，请稍等...',
              'duration': 3
            })
            return
          }
          this.menuData[index].disabled = true
        }
      }
      var GET_LIST_JSONP = Config.App_Server + 'api/quest?type=list&mid=' + id + '&token=' + this.token
      this.isShow1 = false
      this.isShow = true
      stream.fetch({
        method: 'GET',
        url: GET_LIST_JSONP,
        type: 'jsonp'
      }, function (ret) {
        if (!ret.ok) {
          me.isShow = false
          me.errorshow = true
        } else {
          if (ret.data.error == 1) {
            modal.alert({
              'message': ret.data.msg,
              'duration': 3
            })
          } else {
            me.isShow = false
            me.isShow2 = true
            me.errorshow = false
            me.menuid = id
            let data = ret.data.quest
            me.cardLength = data.length
            me.myquest = ret.data.myquest
            for (let index = 0; index < me.cardLength; index++) {
              const list = data[index].q_list.split("\r\n")
              let mylist = []
              const ListItem = ['A.', 'B.', 'C.', 'D.', 'E.', 'F.', 'G.', 'H.']
              for (let index2 = 0; index2 < list.length; index2++) {
                if (list[index2])mylist[index2] = {title: ListItem[index2] + list[index2], value: index2 + 1}
              }
              data[index].list = mylist
            }
            console.log('ret.data=', data)
            me.listData = data
            me.progress_time = -1
            me.$refs['wxc-ep-slider'].manualSetPage(0)
            me.runtime()
          }
        }
      }, function (response) {
        me.errorshow = true
        me.isShow = false
      })
    }
  },
  created: function () {
    var me = this
    var GET_MENU_JSONP = Config.App_Server + 'api/quest?type=menu&token=' + this.token
    stream.fetch({
      method: 'GET',
      url: GET_MENU_JSONP,
      type: 'jsonp'
    }, function (ret) {
      if (!ret.ok) {
        me.isShow = false
        me.errorshow = true
      } else {
        if (ret.data.error == 1) {
          modal.alert({
            'message': ret.data.msg,
            'duration': 3
          })
        } else {
          me.isShow = false
          me.isShow1 = true
          me.errorshow = false
          console.log('get:', ret.data)
          me.menuData = ret.data
          // me.getJsonpResult =  JSON.stringify(ret.data);
        }
      }
    }, function (response) {
      me.isShow = false
      me.errorshow = true
    })
  }
}
</script>

<style scoped>
  .wrapper {
    justify-content: flex-start;
    align-items: center;
  }
  .questImage {
    margin:30px;
    width: 750px;
    height: 380px;
    flex-direction:row;
    justify-content: center;
    align-items: center;text-align: center;
  }
  .greeting {
    text-align: center;
    margin-top: 70px;
    font-size: 50px;
    color: #41B883;
  }
  .message {
    margin: 30px;
    font-size: 32px;
    color: #727272;
  }
  .user-container {
    width: 300px;
    align-items: center;
    justify-content: center;
  }
  .item-container {
    width: 750px;
    background-color: #f2f3f4;
    align-items: center;
    justify-content: flex-start;
  }
  .text-container {
    margin:30px;
  }
  .button {
    margin:30px;
  }
  .scroller {
    width: 750px;
    height: 1000px;
    padding-bottom:100px;
  }

  .slider {
    width: 700px;
    height: 1000px;
    background-color: #FFF;
    /*align-items: left;
    justify-content: center;*/
  }
  .slider0 {
    background-color: #FFF;
  }

  .slider1 {
    background-color: #E8E8E8;
  }

  .slider2 {
    background-color: #EEE;
  }

  .slider3 {
    background-color: #E8E8E8;
  }

  .wtprogress{
    flex-direction: row;
    align-items: center;
    /*margin: 30px;*/
    margin-bottom: 30px;
    margin-right: 30px;
  }
  .progress-text {
    color: #333333;
    font-size: 30px;
  }
  .left {
    margin-right: 20px;
  }
  .right {
    margin-left: 20px;
  }
  .category {
    margin-bottom: 20px;
    padding-left: 24px;
    width: 750px;
    height: 68px;
    background-color: #889FFF;
    justify-content: center;
  }
  .category-text {
    color: #000000;
    font-weight: 600;
    font-size: 30px;
  }
  .border-cell {
    background-color: #f2f3f4;
    width: 750px;
    height: 24px;
    align-items: center;
    justify-content: center;
    border-bottom-width: 1px;
    border-style: solid;
    border-color: #e0e0e0;
  }

  .cell {
    background-color: #ffffff;
  }

  .content{
    width:750px;
    height:260px;
    border-bottom-width:1px;
    align-items: center;
    justify-content: center;
  }
  .useravatar{
    width:150px;height:150px;border-radius:50px;
  }
  .usertime{
    color: #727272;
  }
  .title {
    margin-top: 30px;
    font-size: 40px;
    font-weight: 600;
    color: #000000;
    text-align: center;
    align-items: center;
    justify-content: center;
  }
</style>
