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