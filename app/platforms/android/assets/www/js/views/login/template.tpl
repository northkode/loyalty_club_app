<mobile-view class="login_page">
	<mobile-header title="" no-title no-back></mobile-header>
	<div class="content">
		<div class="form">
			<img src="./img/main_logo.png">
			<div class="option-holder">
				<p>Join our loyalty rewards program and earn points for free golf, beverages, equipment and more!</p>
				<div class="systemButton button create-btn"> Create Account </div>
				<div class="systemButton button show-login"> Login Account </div>
				<div class="login-form">
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

					<button class="back-to-options"> <i class="fa fa-angle-left"></i> Back </button>
				</div>
			</div>
			<!--<p class="terms">By logging in or creating an account you are accepting our terms of use.</p>-->
			<div class="create-form">
				<button class="back"> <i class="fa fa-angle-left"></i> Back </button>
				<h2>Create Account</h2>
				<p style="color:white;margin-top:0;">Earn <strong style="color: rgb(255, 186, 20);" class="points_signup">100 free</strong> loyalty points when you signup.</p>
				<div class="field">
					<input type="text" name="first_name" placeholder="First Name" />
				</div>
				<div class="field">
					<input type="text" name="last_name" placeholder="Last Name" />
				</div>
				<div class="field">
					<input type="email" name="username" placeholder="Email Address" />
				</div>
				<div class="field">
					<input type="password" name="password" placeholder="Password" />
				</div>
				<div class="field birthday">
					<input type="tel" name="mth" placeholder="MM" /> /
					<input type="tel" name="day" placeholder="DD" /> /
					<input type="tel" name="year" placeholder="YY" />
				</div>
				<span style="font-size: 11px;text-align: center;color: rgb(246, 196, 39);width: 60%;line-height:13px;">**This is used as a security question if you forget your password.</span>
				<div class="field">
					<p style="margin-bottom: 0;color:white;text-align:center;">If you know your friends referral code, enter here:</p>
					<input type="text" name="referral" placeholder="Referral code" />
				</div>
				<div class="systemButton button signup-btn"> Signup
					<div class="spinner"></div>
				</div>
			</div>

			<div class="forgot-password-modal">
				<button class="back"> <i class="fa fa-angle-left"></i> Back </button>
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
