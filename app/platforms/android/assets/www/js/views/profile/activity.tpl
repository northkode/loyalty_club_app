<%
var programs = rc;
for(var i=0;i < programs.length; i++) {
	var program = programs[i];
	if(program.purchases.length == 0) continue;
%>
<h2> <%= program.name %> </h2>
<ul>
<%
	for( var j=0; j < program.purchases.length; j++){
		var purchase = program.purchases[j];
		%>
		<li class="no-arrow">
			<div class="points">
				<span class='pts'><%= purchase.points%> <i>pts</i></span>
				<div>$<%= purchase.amt %></div>
			</div>
			<div class="label"><%= purchase.purchase_type %></div>
		</li>
		<%
	}
%>
</ul>
<%
}
%>
