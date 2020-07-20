// components/challenge/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    
  },

  /**
   * 组件的初始数据
   */
  data: {
    
    list:[
      {
        receiveStatus:1,//已领        
        day:'1',
        reward:'+10',
        iconPath:'../../images/icon-got-the-points@2x.png'       
      },
      {
        receiveStatus: 4, //过期      
        day: '2',
        reward: '+10',
        iconPath: '../../images/icon-10-points-black@2x.png'              
      },      
      {
        receiveStatus: 1,//补领       
        day: '3',
        reward: '+10',
        iconPath: '../../images/icon-10-points@2x.png'         
      },      
      {
        receiveStatus: 3,//补领       
        day: '4',
        reward: '+10',
        iconPath: '../../images/icon-10-points@2x.png'           
      },
      {
        receiveStatus: 2,//还不到时间领      
        day: '5',
        reward: '+10',
        iconPath: '../../images/icon-10-points@2x.png'              
      },      
      {
        receiveStatus: 2,//还不到时间领      
        reward: '+10',
        day: '6',
        iconPath: '../../images/icon-10-points@2x.png'             
      },
      {
        receiveStatus: 2,//还不到时间领       
        day: '7',
        reward: '+50',
        iconPath: '../../images/icon-50-points@2x.png'             
      }
    ]
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // filterStatus(item){
    //   const str=''
    //   if(item){
    //     str = item.status == 0 ? '已领' : (item.status == 1 ? '过期' : item.reward)
    //   }
    //   return str;
    // }



  }
})
