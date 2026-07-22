WebCms.ensure('util.loadEs6Module', function(url) {
	// 部MinBrowse器不兼容，插件Version先隐藏
	var a = WebCms.webplayer.downloadAddr + url;
	return import(a);
});
WebCms.ensure('util.importEs6Global', function(url, names) {
	// 部MinBrowse器不兼容，插件Version先隐藏
	var a = WebCms.webplayer.downloadAddr + url;
	return import(a).then(function(mod) {
		names.forEach(function(name) {
			window[name] = mod[name];
		});
		return window;
	});
});