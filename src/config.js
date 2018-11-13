export default {
  tabIconFontTitles: [
    {
      title: '知识问答',
      codePoint: '\ue623'
    },
    {
      title: '排名榜',
      codePoint: '\ue752'
      // badge: 5
    },
    {
      title: '个人信息',
      codePoint: '\ue601'
      // dot: true
    }
  ],
  tabIconFontStyles: {
    bgColor: '#FFFFFF',
    titleColor: '#666666',
    activeTitleColor: '#3D3D3D',
    activeBgColor: '#FFFFFF',
    isActiveTitleBold: true,
    width: 160,
    height: 120,
    fontSize: 24,
    textPaddingLeft: 10,
    textPaddingRight: 10,
    iconFontSize: 50,
    iconFontMarginBottom: 8,
    iconFontColor: '#333333',
    activeIconFontColor: 'red',
    iconFontUrl: '//at.alicdn.com/t/font_501019_mauqv15evc1pp66r.ttf'
  },
  tabStylesPage: {
    bgColor: '#FFFFFF',
    titleColor: '#666666',
    activeTitleColor: '#3D3D3D',
    activeBgColor: '#FFFFFF',
    isActiveTitleBold: true,
    width: 300,
    height: 50,
    fontSize: 40,
    hasActiveBottom: true,
    activeBottomColor: '#FFC900',
    activeBottomHeight: 6,
    activeBottomWidth: 270,
    textPaddingLeft: 15,
    textPaddingRight: 15
  },
  App_Server: '//192.168.1.105/', // 'http://113.204.36.164:8081/'
  Img_Server: '//192.168.1.105/upload/',
  MyToken: 'test_token_vue',
  App_Title: '知识问答'
}
