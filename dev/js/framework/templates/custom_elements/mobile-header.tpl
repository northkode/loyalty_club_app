<div class="colorbg"></div>
<div class="backBtn systemButton"></div>
<div class="title" data-title="<%= rc.title %>">
    <% if(rc.titleIsImage == "true") { %>
        <img src="<%= rc.title %>">
    <% } else { %>
        <%= rc.title %>
    <% } %>
</div>
<% if(rc.icon != undefined) { %>
<div class="icon systemButton">
    <img src="<%= rc.icon %>">
</div>
<%}%>

<% if(rc.showTip != undefined) { %>
	<% if(rc['menu-text'] != undefined) { %>
		<user-tip show-help="true" text="<%= rc.showTip %>" data-menu="true" big-assistant="true"></user-tip>
		<div class="icon systemButton">
			<span><%= rc['menu-text'] %></span>
		</div>
	<%}else{%>
		<user-tip show-help="true" text="<%= rc.showTip %>" big-assistant="true"></user-tip>
	<%}%>
<%} else {%>
	<% if(rc['menu-text'] != undefined) { %>
	<div class="icon systemButton">
	    <span><%= rc['menu-text'] %></span>
	</div>
	<%}%>
<%}%>
