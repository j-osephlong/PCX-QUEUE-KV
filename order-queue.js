let orders = []
let prevOrders = JSON.parse(localStorage.getItem('PrevOrders')) == null? [] :  JSON.parse(localStorage.getItem('PrevOrders'))
var currentOrder = null;
var nextOrder = null;
var init = true;

let parkingSpotMax = 4;
var selectedSpot = "N/A";

document.addEventListener("DOMContentLoaded", function(event){
    // addOrderDOM({'spot':2, 'name': 'John', 'pay-type': 'COF'})
    // addOrderDOM({'spot':1, 'name': 'Ellise', 'pay-type': 'DEBIT + Pts'}) 
    // addOrderDOM({'spot':1, 'name': 'Ellise', 'pay-type': 'DEBIT + Pts'}) 

    $("#nextButton").click(function(){nextOrderDOM()})
    $("#addButton").click(function(){addOrderDialog()})
    $("#prevButton").click(function(){previousOrders()})

    $('#add-note-button').click(function()
    {
        $('#notes-div').css('transform', 'translate(-100%, 0)')
    })

    $('#notes-div').focus(function(){$('#notes-div').css('transform', 'translate(100%,0)')})
})

function previousOrders()
{
    $('body').append(
        $('<div id="prev-div"></div>')
        .append(
            $('<div id="prevQueue"></div>')
        )
        .append(
            $('<div class="exit-button">X</div>').click(
                function (){
                    $('#prev-div').remove()
                }
            )
            .css('position', 'absolute')
            
        )
    )

    for (i = prevOrders.length-1; i >= 0; i--)
    {
        order = prevOrders[i]
        $("#prevQueue").append(
            $("<div class='item'></div>")
            .append(
                $("<div class='spot'>"+order['spot']+"</div>")
            )
            .append(
                $("<div class='name'>"+order['name']+"</div>")
            )
            .append(
                $("<div class='pay-type'>"+order['pay-type']+"</div>")
            )
            .append(
                $('<div class="hidden-stats" style="display:none"></div>')
                .append(
                    $('<p style="margin:5px">Time Elapsed:' + order['timeElapsed']+'</p>')
                )
            )
            .click(function(){
                $(this).find('.hidden-stats').css('display', 'block')
            })
        )
    }
}

function addOrderDialog()
{
    selectedSpot = "N/A"
    var posInfo = null;
    
    if (orders.length > 0)
        posInfo = document.getElementById(orders[orders.length-1]['id']).getBoundingClientRect()
    else if (prevOrders.length > 0 && init != true)
        posInfo = document.getElementById(prevOrders[prevOrders.length-1]['id']).getBoundingClientRect()
    else
        posInfo = document.getElementById("init-item").getBoundingClientRect()
    if (init == true)
        init = false;

        
        
    $('body').append(
        $('<div class="new-order-bg"></div>')
        .append(
            $('<div class="new-order-dialog" id = "newDialog"></div>')
            .css('top', (posInfo.bottom + 10)+"px")
            .css('left', (posInfo.left) + "px")
            .css('width', (posInfo.width)+"px")
            .append(
                $('<div class = "spot" id="spot-selection">?</div>')
            )
            .append(
                $('<div></div>').append(
                    $('<div class = "name"><input type="text" id="name-selection" placeholder="Customer Name"></div>')
                ).append($('<br>')).append(
                    $('<div class = "name"><input type="text" id="notes" placeholder="Notes"></div>')
                ).css('display', 'inline-block')
            )
            .append(
                $(
                    `<div class = "pay-type">
                        <select id="pay-type-selection">
                            <option value = "COF">COF</option>
                            <option value = "COF+Pts">COF+Pts</option>
                            <option value = "DEBIT">DEBIT</option>
                            <option value = "DEBIT+Pts">DEBIT+Pts</option>
                        </select>
                    </div>
                    `
                ).css('margin-left', 'auto')
            )
            .append(
                $('<button>Done</button>').click(function()
                {
                    order = {'name':$('#name-selection').val(),
                                'spot':$('#spot-selection').html(),
                                'pay-type':$('#pay-type-selection').val(),
                                'hasNotes':$('#notes').val() == '' ? false:true,
                                'notes':$('#notes').val(),
                                'timeAdded': new Date(),
                            }
                    order['id'] = order['name'] + order['timeAdded'].getHours() + order['timeAdded'].getMinutes()
                    console.log(order)
                    addOrderDOM(order)
                    $('.new-order-bg').remove()
                })
            )
        ).append(
            $('<div class="exit-button">X</div>').click(
                function (){
                    $('.new-order-bg').remove()
                }
            )
            .css('position', 'absolute')
            
        )
        
    )

    $('#spot-selection').click(function(e){spotDialog(e)})
}

function spotDialog(e)
{
    $('.new-order-bg').append
    (
       $('<div class="spot-dialog"></div>') 
    )
    for(i = 1; i <= parkingSpotMax; i++)
    {
        $('.spot-dialog').append(
            $('<div class="spot" id="'+i+'">'+i+'</div>')
            .css('margin', '5px')
            .click(function(){
                selectedSpot = $(this).attr('id')
                $('#spot-selection').html(selectedSpot+"")
                $('.spot-dialog').remove()
            })
        ).css('top', e.clientY+"px").css('left', e.clientX+"px")
    }

    $('.spot-dialog').append(
        $('<div class="spot" id="N/A">N/A</div>')
        .css('margin', '5px')
        .css('font-size', '20px')
        .click(function(){
            selectedSpot = $(this).attr('id')
            $('#spot-selection').html(selectedSpot+"")
            $('.spot-dialog').remove()
        })
    )
}

function addOrderDOM (order)
{
    orders.push(order)

    $("#queue").append(
        $("<div class='item'></div>")
        .append(
            $("<div class='spot'>"+order['spot']+"</div>")
        )
        .append(
            $("<div class='name'>"+order['name']+"</div>")
        )
        .append(
            $("<div class='pay-type'>"+order['pay-type']+"</div>")
        ).attr('id', order['id'])
    )

    if (orders.length == 1)
        $("#"+order['id']).css('width', '100%').css('padding', '20px')
}

function nextOrderDOM()
{
    if (orders.length < 1)
        return;
    $("#init-item").remove()
    if (prevOrders.length > 0)
        $('#'+prevOrders[prevOrders.length-1]['id']).remove()
    orders[0]['timeOfCompletion'] = new Date()
    orders[0]['timeElapsed'] = (orders[0]['timeOfCompletion']-orders[0]['timeAdded'])/1000
    prevOrders.push(orders[0])
    localStorage.setItem('PrevOrders', JSON.stringify(prevOrders))
    orders.shift()
   

    if (prevOrders.length > 0)
        $('#'+prevOrders[prevOrders.length-1]['id']).css('width', '80%').css('padding', '10px').css('opacity', '0.8')
    if (orders.length > 0)
        $('#'+orders[0]['id']).css('width', '100%').css('padding', '20px')

    currentOrder = orders[1]
    nextOrder = orders[2]
}