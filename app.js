/*! app.js (natori) / Copyright (c) 2015 Retorillo */

var viewmodel, clipboard;
$(function () {
	viewmodel = new ViewModel();
	ko.applyBindings(viewmodel);

	ZeroClipboard.config({ swfPath: "./zeroclipboard.swf" });
	clipboard = new ZeroClipboard($('.update-button'));
	clipboard.on('ready', function (event) {
		clipboard.on('copy', function (event) {
			viewmodel.update(true);
			event.clipboardData.setData('text/plain', viewmodel.output);
		});
	});
	clipboard.on('error', function (event) {
		$(".update-button").click(function () {
			viewmodel.update(false);
		});
	});
	viewmodel.update(false);
});
// ViewModel for Knockout (ES5)
function ViewModel() {
	var last_format = localStorage ? localStorage.getItem('natori_format') : undefined;

	// Properties and Fields
	var _self = this;
	var updateBtn = $("#update");
	//var outputLabel = $("#output");
	//var messageLabel = $("#msg");
	_self.format = last_format || "{month:2}-{day:2}-{randa:3}";
	_self.output = ""
	_self.history = [];
	_self.literals = literals.ja;
	ko.track(_self);
	// Methods and Events
	ko.getObservable(_self, 'format').subscribe(function (newValue) {
		localStorage ? localStorage.setItem('natori_format', newValue) : undefined;
		_self.update();
	});
	$("#output").focus(function () {
		$(this).select();
	});
	$(".templatebtn").each(function (index, element) {
		var e = $(element)
		e.click(function () {
			_self.format = e.data("template");
		});
	});
	_self.update = function (showCopiedMessage) {
		showCopiedMessage = showCopiedMessage === true;

		var expander = new natori.Expander(_self.format, new Date());
		var result = expander.expand();
		_self.output = result;
		_self.history.push(result);

		var copiedBg = $('.copied-text-bg').clone();
		$('.copied-text-bg').remove();
		copiedBg.find('.copied-text').text(_self.output);
		copiedBg.appendTo('.copied-text-root');

		var copiedMessage = $('.copied-msg').clone();
		$('.copied-msg').remove();
		if (showCopiedMessage)
			copiedMessage.text(this.literals.copiedMsg);
		else
			copiedMessage.text('');
		copiedMessage.appendTo('.copied-msg-root');
	};
}

var literals = {};
literals.ja = {
	outputLbl: '出力された名前',
	formatLbl: '出力する形式',

	appSubTitle: '名前、ID、パスワードをランダムで生成',
	howToUse: 'このアプリの使い方',

	fmtCatName: 'ファイル名',
	fmtCatSecurity: 'セキュリティ',
	dateAndRand3: '日付とランダムな3文字',
	dateAndTime: '日付と時刻',
	digit4: '4ケタの暗証番号',
	easyPassword: '簡易的なパスワード',
	normalPassword: '標準的なパスワード',
	computerName: 'コンピューター名',

	copiedMsg: 'クリップボードにコピーされました',

	aboutModalTitle: 'このアプリの使い方',
	aboutModalHead1: '青い帯をクリックするだけ！',
	aboutModalDesc1: 'クリックするだけで新しい名前が生成されクリップボードにコピーされます。このアプリでさまざまなシーンでの名前を考える時間を節約しましょう！出力する形式を選択・カスタマイズして暗証番号、パスワードやコンピューター名などとして使うこともできます。',
	aboutModalNote1: 'スマートフォンなど一部のブラウザでは、自動的なクリップボードへのコピーがうまくいかない場合があります。お手数おかけいたしますが、下のテキストボックスから手動でコピーしてください。',
	aboutModalHead2: 'このアプリは開発途中です',
	aboutModalDesc2: '最新情報は以下のツイッターアカウントまたはGitHubでお知らせします。ご希望・ご要望もお気軽にお寄せください。',

	funcModalTitle: '出力フォーマットについて',
	funcModalDesc: '以下の関数を使用してさまざまなカスタム形式の名前を生成できます',
	funcModalTable:  [
	{ n: "関数", d: "説明", h: true },
	// { n: "{asort: ...}", d: "昇順でソートします。例えば{sort:5132}の結果は1235です" },
	// { n: "{dsort: ...}", d: "降順でソートします。例えば{sort:5132}の結果は5321です" },
	// { n: "{rsort: ...}", d: "含まれる文字をランダムにソートします。" },
	// { n: "{hex: ...}", d: "含まれる数値を16進数に変換します"},
	{ n: "{lcase: ...}", d: "アルファベットをすべて小文字に変更します。{lcase:{randa:4}}などとして使います。" },
	{ n: "{ucase: ...}", d: "アルファベットをすべて大文字に変更します。{ucase:{randa:4}}などとして使います。" },
	{ n: "{rcase: ...}", d: "アルファベットをランダムで大文字か小文字に変更します。{rcase:{randa:4}}などとして使います。" },
	{ n: "{rand:n}", d: "aからzまでのアルファベットと0から9までの数字からランダムにn個出力します。nの規定値は3です。" },
	{ n: "{randn:n}", d: "0から9までの数字からランダムにn個出力します。nの規定値は3です。" },
	{ n: "{randa:n}", d: "aからzまでのアルファベットからランダムにn個出力します。nの規定値は3です。" },
	{ n: "{year:n}", d: "nには2または4が指定できます。nに4を指定したとき、西暦4桁が出力されます。nに2を指定したときは西暦の下2桁が出力されます。nの規定値は4です。" },
	{ n: "{month:n}", d: "1から12の数字で月を出力します。桁数よりもnで指定した数のほうが大きい場合はその分だけ0が左に埋められます。nの規定値は2です。" },
	{ n: "{day:n}", d: "1から31の数字で日を出力します。桁数よりもnで指定した数のほうが大きい場合はその分だけ0が左に埋められます。nの規定値は2です。" },
	{ n: "{hour:n}", d: "1から24までの数字で時間を出力します。桁数よりもnで指定した数のほうが大きい場合はその分だけ0が左に埋められます。nの規定値は2です。" },
	{ n: "{min:n}", d: "0から59までの数字で分を出力します。桁数よりもnで指定した数のほうが大きい場合はその分だけ0が左に埋められます。nの規定値は2です。" },
	{ n: "{sec:n}", d: "0から59までの数字で秒を出力します。桁数よりもnで指定した数のほうが大きい場合はその分だけ0が左に埋められます。nの規定値は2です。" },
	{ n: "{msec:n}", d: "0から999までのミリ秒を出力します。桁数よりもnで指定した数のほうが大きい場合はその分だけ0が左に埋められます。nの規定値は3です。" },
	{ n: "{week:n}", d: "sunからsatまでの曜日を表す3文字を出力します" },
	],

}
