// ==UserScript==
// @name AwEco
// @description BC转账支持
// @version v1.0.2
// @namespace awaqwq_huzpsb
// @match *://*/*BondageClub*
// @grant GM_registerMenuCommand
// ==/UserScript==

(function() {
    GM_registerMenuCommand('开启Aw钱包', ()=>{
        if (this.inited != undefined) {
            alert('你已经开启了Aw钱包!');
            return;
        }
        AwEco = function(data) {
            let character = ChatRoomCharacter.find((c)=>c.MemberNumber == data.Sender)
            //console.log(data);
            if (data.Type == 'Hidden' && data.Content == 'AwEco') {
                if (data.Dictionary.id == Player.MemberNumber) {
                    Player.Money += data.Dictionary.sum;
                    ChatRoomSendLocal('Aw钱包 >' + character.Name + '(' + data.Sender + ') 向您转账了 ' + data.Dictionary.sum + ' 游戏币.您当前游戏币余额: ' + Player.Money + ' 转账理由: ' + data.Dictionary.reason);
                    ServerSend('ChatRoomChat', {
                        "Content": "AwEcoConfirm",
                        "Type": "Hidden",
                        "Dictionary": {
                            "id": data.Sender,
                            "sum": data.Dictionary.sum
                        }
                    });
                    ChatRoomCharacterUpdate(Player);
                }
            } else if (data.Type == 'Hidden' && data.Content == 'AwEcoConfirm') {
                if (data.Dictionary.id == Player.MemberNumber) {
                    Player.Money -= data.Dictionary.sum;
                    ChatRoomCharacterUpdate(Player);
                    ChatRoomSendLocal('Aw钱包 > 转账成功!');
                } else {
                    let sender = ChatRoomCharacter.find((c)=>c.MemberNumber == data.Dictionary.id)
                    ChatRoomSendLocal('Aw钱包 >' + sender.Name + ' 向' + character.Name + '转账了 ' + data.Dictionary.sum + ' 游戏币.');
                }
            }
            ;
        }
        ;
        ServerSocket.on('ChatRoomMessage', AwEco);
        this.inited = true;
        alert('开启成功!');
    }
    );

    GM_registerMenuCommand('转账', ()=>{
        if (this.inited == undefined) {
            alert('请先开启Aw钱包!');
            return;
        }
        if (CurrentCharacter == null) {
            alert('请选中您要转给的玩家!');
            return;
        }
        var sum = parseInt(prompt('转账金额(点击取消可以取消转账)', '100'));
        if (sum > 0) {
            if (Player.Money >= sum) {
                var why = prompt('转账理由(最后一次确认:点击取消可以取消转账)', '喵呜~');
                if (why != undefined) {
                    ServerSend('ChatRoomChat', {
                        "Content": "AwEco",
                        "Type": "Hidden",
                        "Dictionary": {
                            "id": CurrentCharacter.MemberNumber,
                            "sum": sum,
                            "reason": why
                        }
                    });
                }
            }
        }
    }
    );
}
)();
