new Vue({
	el: '#app',
	data: {
		login_bottom: '西农交响微信小程序管理平台',
		sessionid: localStorage.sessionid,
		isLogin: localStorage.sessionid ? 'nologin' : 'login',
		isPage: localStorage.sessionid ? 'page' : 'nopage',
		passwd: '',
		account: '',
		allUsers: localStorage.allUsers?JSON.parse(localStorage.allUsers):{},
	},
	methods: {
		submit: function(event) {
			event.preventDefault();
			var submitData = {
				account: this.account,
				passwd: this.passwd
			}
			var that = this;
			$.ajax({
				url: 'https://www.nwsuaforchestra.cn/myLogin',
				type: 'POST',
				data: submitData,
				success: function(res) {
					if (res.success) {
						alert('登录成功!');
						localStorage.sessionid = res.sessionid;
						that.sessionid = localStorage.sessionid;
						that.isLogin = localStorage.sessionid ? 'nologin' : 'login';
						that.isPage = localStorage.sessionid ? 'page' : 'nopage';
						that.loadUsers();
					} else {
						alert('用户名或密码错误');
					}
				}
			})
		},

		loadUsers: function() {
			var that = this;
			$.ajax({
				url: 'https://www.nwsuaforchestra.cn/getAllUsers',
				type: 'GET',
				success: function(res) {
					if (res.success) {
						var userData = res.userData
						console.log(userData);
						that.allUsers = userData;
						localStorage.allUsers = JSON.stringify(userData);
					} else {
						alert('获取用户信息错误！');
					}
				}
			})
		},
	}
})