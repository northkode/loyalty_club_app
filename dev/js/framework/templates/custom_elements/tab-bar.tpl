<div class="tabbar">
    <%
        for(var i=0;i< rc.tabs.length;i++){
    %>
        <%
            if(i == 0){
        %>
            <div class="tabbar__tab active" data-ui-href="<%=rc.tabs[i]%>"><%= rc.tabs[i] %></div>
        <% } else{ %>
            <div class="tabbar__tab" data-ui-href="<%=rc.tabs[i]%>"><%= rc.tabs[i] %></div>
        <%}%>
    <%}%>
</div>