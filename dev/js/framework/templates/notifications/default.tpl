<div class="notification fadeInRight" data-type="<%=rc.payload.additionalData.action%>">
	<% if(rc.payload.additionalData && rc.payload.additionalData.picture) {%>
	<div class="icon" style="background-image:url(<%= rc.payload.additionalData.picture %>)">  </div>
	<% } %>
	<div class="message-holder">
        <div class="label"><%= rc.payload.title %></div>
        <div class="message">
            <%= rc.payload.body %>
        </div>
    </div>
    <img src="img/notification_close.png" class="close" style="filter:brightness(10)">
</div>
