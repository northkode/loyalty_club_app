<div class="tip-holder">
	<div class="tip <%= (rc.isTip) ? '' : 'noTip' %>" data-direction="<%=rc.direction%>">
		<span class="arrow"></span>
		<p><%= rc.content %></p>
	</div>
</div>
