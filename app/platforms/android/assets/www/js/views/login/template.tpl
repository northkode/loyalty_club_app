<mobile-view class="login_page">
	<mobile-header title="" no-title></mobile-header>
	<div class="content">
		<div class="form">
			<img src="./img/The_Loyalty_Club.png">
			<div class="login-form ">
				<h2>Login to Your Account</h2>
				<div class="field">
					<input type="email" name="email" placeholder="Username" />
				</div>
				<div class="field">
					<input type="password" name="password" placeholder="Password" />
				</div>
				<div class="systemButton button send-login"> Login
					<div class="spinner"></div>
				</div>
				<p class="forgot-password">Forgot Password?</p>
			</div>

			<div class="forgot-password-modal">			
				<h2>Forgot Username or Password</h2>
				<div class="field">
					<input type="email" name="email" placeholder="Please enter your email" />
				</div>
				<div class="field birthday">
					<input type="text" name="mth" placeholder="mth" /> /
					<input type="text" name="day" placeholder="day" /> /
					<input type="text" name="year" placeholder="year" />
				</div>
				<div class="systemButton button forgot-btn"> Submit
					<div class="spinner"></div>
				</div>
			</div>
		</div>
	</div>
</mobile-view>
