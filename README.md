# Temp
function dateF1(dateIn) {
    var mm = dateIn.getMonth() + 1; // getMonth() is zero-based
    var dd = dateIn.getDate();
    var hh = dateIn.getHours();
    var mi = dateIn.getDate();

    return [dateIn.getFullYear(),
    (mm > 9 ? '' : '0') + mm,
    (dd > 9 ? '' : '0') + dd
    ].join('/') + "" + [(hh > 9 ? '' : '0') + hh,
    (mi > 9 ? '' : '0') + mi].join(':');
};

$(function () {
    $('.edit').hide();
    $('.edit-case').on('click', function () {
        var tr = $(this).parents('tr:first');
        tr.find('.edit, .read').toggle();
    });
    $('.update-case').on('click', function (e) {
        e.preventDefault();
        var tr = $(this).parents('tr:first');

        var d1 = new Date();      
        var d1S = dateF1(d1);
        
        var userObj = {
            Id: $(this).prop('id'),
            Name: tr.find('#Name').val(),
            Role: tr.find('#Role').val(),
            UpdatedAt: d1,
            Status: tr.find('#Status').val()
        };
        
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: window.location.protocol + "//" + window.location.host + "/" + "Home/Update",
            data: JSON.stringify(userObj),
            dataType: "json",
            success: function (data) {
                tr.find('.edit, .read').toggle();
                $('.edit').hide();
                tr.find('#name').text(userObj.Name);
                tr.find('#role').text(userObj.Role);
                tr.find('#updatedAt').text(d1S);                
                tr.find('#status').text(userObj.Status);
            },
            error: function (err) {
                alert("error");
            }
        });
    });
    $('.cancel-case').on('click', function (e) {
        e.preventDefault();
        var tr = $(this).parents('tr:first');
        var id = $(this).prop('id');
        tr.find('.edit, .read').toggle();
        $('.edit').hide();
    });
    $('.delete-case').on('click', function (e) {
        e.preventDefault();
        var tr = $(this).parents('tr:first');     

        id = $(this).prop('id');

        if (!confirm("Are you sure you want to deleted the selected record?")) {
            return;
        }

        $.ajax({
            type: 'POST',
            contentType: "application/json; charset=utf-8",
            url: window.location.protocol + "//" + window.location.host + "/" + "Home/Delete/" + id,
            dataType: "json",
            success: function (data) {
                //alert('Delete success');
                window.location.href = window.location.protocol + "//" + window.location.host + "/" + "Home/Index";
            },
            error: function () {
                alert('Error occured during delete.');
            }
        });
    });
});

function Add() {
    if (!validateForm()) {
        return false;
    }
   
    var userObj = {
        Id: 0,
        Name: $('#txtName').val(),
        Role: $('#selRole').val(),
        Status: $('#selStatus').val()
    };
    $.ajax({
        url: window.location.protocol + "//" + window.location.host + "/" + "Home/Add",
        data: JSON.stringify(userObj),
        type: "POST",
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (result) {
            window.location.href = window.location.protocol + "//" + window.location.host + "/" + "Home/Index";
            $('#myModal').modal('hide');
        },
        error: function (errormessage) {
            alert(errormessage.responseText);
        }
    });
}

function Edit(userId) {    
    $('#txtName').css('border-color', 'lightgrey'); 
   
    $.ajax({
        url: "/Home/GetById/" + userId,
        typr: "GET",
        contentType: "application/json;charset=UTF-8",
        dataType: "json",
        success: function (result) {
            console.log(result);
            $('#userId').val(result.user.Id);
            $('#txtName').val(result.user.Name);
            $('#selRole').val(result.user.Role);
            $('#selStatus').val(result.user.Status);           

            $('#myModal').modal('show');
            $('#btnUpdate').show();
            $('#btnAdd').hide();
        },
        error: function (errormessage) {
            alert(errormessage.responseText);
        }
    });
    return false;
}

function Update() {
    if (!validateForm()) {
        return false;
    }

    var userObj = {
        Id: $('#userId').val(),
        Name: $('#txtName').val(),
        Role: $('#selRole').val(),
        Status: $('#selStatus').val()
    };
    $.ajax({
        url: window.location.protocol + "//" + window.location.host + "/" + "Home/Update",
        data: JSON.stringify(userObj),
        type: "POST",
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (result) {
            window.location.href = window.location.protocol + "//" + window.location.host + "/" + "Home/Index";
            $('#myModal').modal('hide');
        },
        error: function (errormessage) {
            alert(errormessage.responseText);
        }
    });
}

function deleteSelected() {
    var selected = [];
   
    $('input[type=checkbox]').each(function () {
        if ($(this).attr('name') == 'chkId') {
            if ($(this).is(":checked")) {
                selected.push($(this).attr('value'));
            }
        }
    });

    console.log(selected);

    if (selected.length == 0)
    {
        alert("Please select the Records to be deleted..");
        return;
    }

    if (!confirm("Are you sure you want to deleted the selected record(s)?")) {
        return;
    }
   
    $.ajax({
        url: window.location.protocol + "//" + window.location.host + "/" + "Home/DeleteAll",
        data: JSON.stringify(selected),
        type: "POST",
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (result) {
            window.location.href = window.location.protocol + "//" + window.location.host + "/" + "Home/Index";
            $('#myModal').modal('hide');
        },
        error: function (errormessage) {
            alert(errormessage.responseText);
        }
    });
}

function checkAll() {
    checkboxes = document.getElementsByName('chkId');
    for (var i = 0, n = checkboxes.length; i < n; i++) {
        if (checkboxes[i].checked)
        {
            checkboxes[i].checked = false;
        }
        else
        {
            checkboxes[i].checked = true;
        }        
    }
}

function initForm() {
    $('#txtName').val("");
    $('#txtName').css('border-color', 'lightgrey'); 
}

function validateForm() {
    var isValid = true;
    if ($('#txtName').val().trim() == "") {
        $('#txtName').css('border-color', 'Red');
        isValid = false;
    }
    else {
        $('#txtName').css('border-color', 'lightgrey');
    } 
   
    return isValid;
}



----------------------

@model IEnumerable<TT_Users.Models.User>
@{
    ViewBag.Title = "Index";
}

<div style="width:900px">
    <div class="panel-heading">
        <div class="row">
            <div class="col col-xs-7">
                <label class="control-label">Members List</label>
            </div>

            
            <div class="col col-xs-5 text-right">
                <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#myModal" onclick="initForm();">Add New</button>
                &nbsp;
                <button type="button" class="btn btn-danger" onclick="deleteSelected();">Delete Selected</button>
            </div>
        </div>
    </div>

</div>


<script src="~/Scripts/TT_User.js"></script>
<div id=" grid">
    @{
        var statusList = Model.Select(app => app.StatusList);
        var statusL = from name in statusList.First()
                      select new SelectListItem
                      {
                          Value = name,
                          Text = name
                      };

        var rolesList = Model.Select(app => app.RolesList);
        var rolesL = from name in rolesList.First()
                     select new SelectListItem
                     {
                         Value = name,
                         Text = name
                     };

        var totalRows = Model.Count();

        var gridview = new WebGrid(source: Model, rowsPerPage: 20);
    }

    @gridview.GetHtml(tableStyle: "webGrid", headerStyle: "header", alternatingRowStyle: "altColor",
columns:
        gridview.Columns(

            gridview.Column(header: "", 
                        format:
                        @<text><input id="chkId" name="chkId" type="checkbox" value="@item.Id" /></text>),
            gridview.Column("Id", "ID"),
            gridview.Column("Name",
                format:
                @<text>
                    <span id="name" class="read">@item.Name</span>
                    @Html.TextBox("Name", (string)item.Name, new { @class = "edit", @maxlength = "50" })
                </text>, style: "nameStyle"),
            gridview.Column("Role",
                format:
                @<text>
                    <span id="role" class="read">@item.Role</span>
                    @Html.DropDownList("Role", rolesL, new { @class = "edit" })
                </text>),
            gridview.Column("UpdatedAt", style: "updateAtStyle",
            format:
            @<text>
                <span id="updatedAt" class="read">@item.UpdatedAt.ToString("dd/MM/yyyy hh:mm")</span>
                @Html.TextBox("UpdatedAt", (string)item.UpdatedAt.ToString("dd/MM/yyyy hh:mm"), new { @class = "edit", @maxlength = "50", @readonly = "readonly" })
            </text>),
            gridview.Column("Status",
                format:
                @<text>
                    <span id="status" class="read">@item.Status</span>
                    @Html.DropDownList("Status", statusL, new { @class = "edit" })
                </text>),
            gridview.Column("Actions", style: "actionStyle", canSort: false,
                format:
                @<text>
                    <button class="btn btn-info btn-xs read" data-toggle="tooltip" data-placement="top" title="Further Details- Mobile: 07856457889" id="@item.Id"><span class="glyphicon glyphicon-info-sign"></span></button>
                    <button class="btn btn-primary btn-xs edit-case read" data-toggle="tooltip" data-placement="top" title="Edit Inline" id="@item.Id"><span class="glyphicon glyphicon-pencil"></span></button>
                    <button class="btn btn-primary btn-xs read" data-toggle="tooltip" data-placement="top" title="Edit Modal" onclick="return Edit(@item.Id)"><span class="glyphicon glyphicon-pencil"></span></button>
                    <button class="btn btn-danger btn-xs delete-case read" data-toggle="tooltip" data-placement="top" title="Delete" id="@item.Id"><span class="glyphicon glyphicon-trash"></span></button>
                    <button class="btn btn-primary btn-xs update-case edit" id="@item.Id">Update</button>
                    <button class="btn btn-xs cancel-case edit" id="@item.Id">Cancel</button>
                </text>)
        ))
</div>

<div style="width:900px">
    <div class="panel-footer">
        <div class="row">
            <div class="col col-xs-2 text-left">
                <input type="checkbox" id="checkAll"  onchange="checkAll();"> Check All
            </div>
            <div class="col col-xs-10 text-right">
                Total Number of Users: @totalRows
            </div>
        </div>
    </div>

</div>

<div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                @*<button type="button" class="close" data-dissmiss="modal"><span aria-hidden="true">&times;</span></button>*@
                <button type="button" class="close" data-dismiss="modal">&times;</button>
                <h4 class="modal-title" id="myModalLabel">Add New User</h4>
            </div>
            <div class="modal-body">
                <form>                    
                    <div class="form-group">
                        <label for="txtName">Name</label>
                        <input type="text" class="form-control" id="txtName" placeholder="Name" maxlength="50" />
                    </div>
                    <div class="form-group">
                        <label for="selRole">Role</label>
                        <select id="selRole" class="form-control">
                            <option>User</option>
                            <option>Manager</option>
                            <option>Administrator</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="selStatus">Status</label>
                        <select id="selStatus" class="form-control">
                            <option>New</option>
                            <option>Active</option>
                            <option>Disabled</option>
                        </select>
                    </div>
                    <input type="hidden" id="userId" />
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-primary" id="btnAdd" onclick="return Add();">Add</button>
                <button type="button" class="btn btn-primary" id="btnUpdate" style="display:none;" onclick="Update();">Update</button>
                <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
            </div>
        </div>
    </div>
</div>
