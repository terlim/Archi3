// Transport
var yandex_wordstat_keywords_add_transport = function(data, callback) {
	chrome.extension.sendMessage(data, callback);
};


// Yandex Wordstat Keywords Add
var yandex_wordstat_keywords_add_init = function($, window, transport) {


	// Версия
	var version = '2.0.11';


	// Смещение блока
	var offset_block = {
		base: 134,
		scroll: 25
	};


	/**
	 * Опции
	 */
	var options = {

		// Сортировка
		order: 'abc', // abc, 123
		sort: 'asc', // asc, desc

		// Обесцвечивать выбранные слова
		desaturate_selected_words: false

	};


	// Тема
	$.nano = function(template, data) {
		return template.replace(/\{([\w\.]*)\}/g, function(str, key) {
			var keys = key.split("."), value = data[keys.shift()];
			$.each(keys, function() {
				value = value[this];
			});
			return (value === null || value === undefined) ? "" : value;
		});
	};


	// Множественная форма слова
	function human_plural_form(n, titles) {
		var cases = [2, 0, 1, 1, 1, 2];
		return titles[(n % 100 > 4 && n % 100 < 20) ? 2 : cases[Math.min(n % 10, 5)]];
	}


	// Добавить пробелы в числах
	function number_spaces(x) {
		return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
	}


	// Основной блок
	var body_template = '<div class="ywka-body">' +
		'	<div class="ywka-log"><div class="ywka-log_i" /></div>' +
		'	<div class="ywka-header">' +
		'		<a href="https://chrome.google.com/webstore/detail/onaeegcgechoaflpkpmdcbgmdfhbbibp/" class="ywka-header_link" target="_blank">' +
		'           <span class="ywka-header_full">Yandex Wordstat Keywords Add {version}</span>' +
		'		    <span class="ywka-header_short">YWKA {version}</span>' +
		'       </a>' +
		'       <div class="ywka-header_settings" style="display:none" title="Настройки" />' +
		'	</div>' +
		'	<div class="ywka-menu">' +
		'		<i class="ywka-menu_add" title="Добавить фразы"></i>' +
		'		<i class="ywka-menu_copy" title="Копировать список в буфер обмена"></i>' +
		'		<i class="ywka-menu_copyCount" title="Копировать список с частотностью в буфер обмена"></i>' +
		'		<i class="ywka-menu_clear" title="Очистить список"></i>' +
		'	</div>' +
		'	<div class="ywka-info">' +
		'		<span class="ywka-info_b ywka-info_countWords" title="Количество фраз">-</span>' +
		'		<span class="ywka-info_b ywka-info_count" title="Суммарная частотность">-</span>' +
		'	</div>' +
		'	<ul class="ywka-list" />' +
		'	<div class="ywka-footer" style="text-align: center;"><a href="https://chrome.google.com/webstore/detail/yandex-wordstat-keywords/onaeegcgechoaflpkpmdcbgmdfhbbibp/reviews" target="_blank"><b>Оставить отзыв</b></a></div>' +
		'	</div>';
	$('BODY').prepend($.nano(body_template, {
		version: version
	}));
	var body = $('.ywka-body');


	// Блок ручного добавления фраз
	var blockAdd = {

		// Блоки
		b: {},


		// Шаблон
		tpl: '<div class="ywka-block ywka-blockAdd">' +
		'   <div class="ywka-block_title">{title}</div>' +
		'   <div class="ywka-block_line">' +
		'       <textarea class="ywka-blockAdd_textarea"></textarea>' +
		'   </div>' +
		'   <div class="ywka-block_line ywka-block_btns">' +
		'       <span class="ywka-btn ywka-btn-primary ywka-blockAdd_add">Добавить фразы</span>' +
		'       <span class="ywka-btn ywka-blockAdd_close">Отмена</span>' +
		'   </div>' +
		'</div>',


		// Добавить фразы
		add: function() {
			var c = list.data.length;
			var lines = blockAdd.b.textarea.val().split(/\r\n|\r|\n/);
			lines.forEach(function(item) {
				item = item.split('\t');
				list.add(item[0], (item.length > 1) ? item[1] : false);
			});
			blockAdd.b.container.hide();
			c = list.data.length - c;
			if (c > 0) {
				log.show('<b>' + c + ' ' + human_plural_form(c, ['фраза', 'фразы', 'фраз']) + '</b> добавлено', 'success');
			} else {
				log.show('Новых фраз не добавлено', 'warning');
			}
		},


		// Инициализация
		init: function() {

			// Добавить блок
			body.append($.nano(this.tpl, {
				title: 'Добавьте свои фразы в ручную'
			}));
			this.b.container = $('.ywka-blockAdd');
			this.b.textarea = blockAdd.b.container.find('.ywka-blockAdd_textarea');

			// Поддержка TAB
			this.b.textarea.bind('keydown', function(e) {
				if (e.keyCode == 9) {
					var $this = $(this);
					var value = $this.val();
					$this.val(value.substring(0, this.selectionStart) + "\t" + value.substring(this.selectionEnd));
					this.selectionStart = this.selectionEnd = this.selectionStart + 1;
					e.preventDefault();
				}
			});

			// Показать блок
			$('.ywka-menu_add').click(function() {
				if (blockAdd.b.container.css('display') == 'none') {
					blockAdd.b.container.show();
					blockAdd.b.textarea.val('').focus();
				} else {
					blockAdd.b.container.hide();
				}
			});

			// Скрыть блок
			blockAdd.b.container.find('.ywka-blockAdd_close').click(function() {
				blockAdd.b.container.hide();
			});

			// Добавить фразы
			blockAdd.b.container.find('.ywka-blockAdd_add').click(this.add);

		}

	};
	blockAdd.init();



	// Элемент списка
	var item_template = '<li><b title="Удалить">—</b><span>{word}</span> ({count})</li>';
	$('.ywka-list').on('click', 'B', function() {
		list.remove($(this).next().text());
	});


	// Основной блок содержимого
	var contentBlock = $('.b-wordstat-content');


	// Добавление элементов управления
	var addElements = function() {
		observer.disconnect();
		var phrases = $('.b-phrase-link');
		if (phrases.length && !phrases.data('ywka-ready')) {
			phrases.data('ywka-ready', true);

			// Кнопки добавления/удаления фраз
			var add_template = '<b class="ywka-add" title="Добавить в список">+</b>';
			var remove_template = '<b class="ywka-remove" title="Удалить из списка">‒</b>';
			phrases.before(add_template + remove_template);
			$('.ywka-add').click(function() {
				list.add($(this).next().next().text(), $(this).parent().next().text());
			});
			$('.ywka-remove').click(function() {
				list.remove($(this).next().text());
			});

			// Добавить все фразы
			var add_all_template = '<div class="ywka-addAllWrap"><b class="ywka-addAll">Добавить все фразы</b></div>';
			$('.b-word-statistics__table').before(add_all_template);
			$('.ywka-addAll').click(function() {
				if (confirm('Вы действительно хотите добавить все фразы с этой страницы?')) {
					var c = list.data.length;
					$(this).closest('.b-word-statistics__table-wrapper').find('.ywka-add').click();
					c = list.data.length - c;
					if (c > 0) {
						log.show('<b>' + c + ' ' + human_plural_form(c, ['фраза', 'фразы', 'фраз']) + '</b> добавлено', 'success');
					} else {
						log.show('Нет фраз для добавления', 'warning');
					}
				}
			});

		}
		doObserver();
	};


	/**
	 * Обновить состояние элементов управления
	 */
	var updateStateElements = function() {
		$('.ywka-remove').each(function() {
			if (list.has($(this).next().text())) {
				$(this).parent().parent().addClass('ywka-selected');
			} else {
				$(this).parent().parent().removeClass('ywka-selected');
			}
		});
	};


	/**
	 * Применить опции
	 */
	var applyOptions = function() {
		options.desaturate_selected_words ? $('BODY').addClass('ywka-desaturateSelectedWords') : $('BODY').removeClass('ywka-desaturateSelectedWords');
	};


	// Отслеживание изменений
	var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
	var observer = new MutationObserver(addElements);
	var doObserver = function() {
		observer.observe(contentBlock.get(0), {childList: true, subtree: true});
	};
	addElements();
	doObserver();


	// Хранилище
	var storage = {

		// Сохранить
		save: function() {
			localStorage['YandexWordstatKeywordsAdd'] = JSON.stringify(list.data);
			localStorage['YandexWordstatKeywordsAddOptions'] = JSON.stringify(options);
		},

		// Загрузить
		load: function(update) {

			// Данные
			var data;
			try {
				data = JSON.parse(localStorage['YandexWordstatKeywordsAdd']);
			} catch (e) {
				data = [];
			}
			if (!$.isArray(data)) data = [];
			list.data = data;

			// Опции
			var o;
			try {
				o = JSON.parse(localStorage['YandexWordstatKeywordsAddOptions']);
			} catch (e) {
				o = {};
			}
			if (typeof(o) != 'object') o = {};
			options = $.extend(true, {}, options, o);

			// Обновить внешний вид
			if (update)
				list.update();
		}

	};


	// Лог
	var log = {

		// Таймер
		timer: undefined,

		// Показать
		show: function(text, type) {
			$('.ywka-log').attr('class', 'ywka-log ywka-log-' + type);
			$('.ywka-log_i').html(text);
			$('.ywka-log').stop(true, true).show();
			clearTimeout(log.timer);
			log.timer = setTimeout(function() {
				$('.ywka-log').fadeOut(300);
			}, 2000);
		}

	};


	// Действия со списком
	var list = {


		// Данные
		data: [],


		// Обновить
		update: function() {
			if ($('input[name="search_type"]:checked').val() == 'words') {
				body.show();
			} else {
				body.hide();
				return;
			}
			var html = '';
			var count = 0;
			var data = list.prepare_data();
			$('.ywka-menu_sort').attr('class', 'ywka-menu_sort ywka-menu_sort-' + options.order + '-' + options.sort);
			$.each(data, function(i, item) {
				html += $.nano(item_template, {
					word: item.word,
					count: item.count > 0 ? number_spaces(item.count) : '?'
				});
				count += item.count;
			});
			if (html != $('.ywka-list').html()) {
				$('.ywka-list').html(html);
				var countWords = $('.ywka-list LI').length;
				$('.ywka-info_countWords').html(countWords == 0 ? '...' : number_spaces(countWords));
				$('.ywka-info_count').html(countWords == 0 ? '...' : number_spaces(count));
			}
			updateStateElements();
		},


		/**
		 * Подготовка данных
		 * @returns array
		 */
		prepare_data: function() {

			// Клонируем список
			var data = list.data.slice(0);

			// Сортировка
			switch (options.order) {

				// По алфавиту
				case 'abc':
					data.sort(function(a, b) {
						var compA = a.word.toUpperCase();
						var compB = b.word.toUpperCase();
						return (compA < compB) ? (options.sort == 'asc' ? -1 : 1) : (compA > compB) ? (options.sort == 'asc' ? 1 : -1) : 0;
					});
					break;

				// По порядку добавления
				case '123':
				default:
					if (options.sort == 'desc')
						data.reverse();
					break;

			}

			// Результат
			return data;
		},


		/**
		 * Добавить фразу
		 * @param t Фраза
		 * @param c Частотность
		 */
		add: function(t, c) {

			// Подготовить фразу
			t = $.trim(t);

			// Подготовить частотность
			c = parseInt((c + '').replace(/[^\d]/gi, ''));
			if (isNaN(c))
				c = 0;

			// Обновить данные из хранилища
			storage.load();

			// Уже есть в списке?
			if (list.data.some(function(item) {
					return item.word == t;
				})) {
				log.show('<b>' + t + '</b> уже добавлена', 'warning');
				t = '';
			}

			// Пустая фраза - ничего не делать
			if (t == '')
				return;

			// Добавить фразу в список
			list.data.push({
				word: t,
				count: c
			});

			// Обновить внешний вид
			list.update();

			// Сохранить в хранилище
			storage.save();

			// Сообщение
			log.show('<b>' + t + '</b> добавлена', 'success');

		},


		// Удалить фразу
		remove: function(t) {

			// Подготовить фразу
			t = $.trim(t);

			// Пустая фраза - ничего не делать
			if (t == '')
				return;

			// Удалить
			list.data = list.data.filter(function(item) {
				return item.word != t;
			});

			// Сообщение
			log.show('<b>' + t + '</b> удалено', 'info');

			// Обновить и сохранить
			list.update();
			storage.save();

		},


		/**
		 * Есть ли слово в списке?
		 * @param t
		 * @returns {boolean}
		 */
		has: function(t) {

			// Подготовить фразу
			t = $.trim(t);

			// Пустая фраза - ничего не делать
			if (t == '')
				return false;

			// Ищем слово
			for (var i = 0; i < list.data.length; i++)
				if (list.data[i].word == t)
					return true;

			// Не нашли
			return false;
		},


		// Очистить список
		clear: function() {
			if (confirm('Точно удалить все фразы?')) {

				// Очистить
				list.data = [];

				// Сообщение
				log.show('Все фразы удалены', 'info');

				// Сохранить и обновить
				list.update();
				storage.save();
			}
		},


		// Копировать
		copy: function(with_count) {

			// Подготовим текст
			var text = '';
			var data = list.prepare_data();
			$.each(data, function(i, item) {
				if (text != '')
					text += '\n';
				text += item.word + (with_count ? ('\t' + (item.count > 0 ? item.count : '?')) : '');
			});

			// А есть что копировать?
			if (text == '') {
				log.show('Нет фраз для копирования', 'warning');
				return;
			}

			// Копируем
			var config = {
				action: 'copy',
				text: text
			};
			transport(config, function(response) {
				if (response.result) {
					log.show('Список фраз скопирован', 'success');
				} else {
					log.show('Не удалось скопировать фразы', 'error');
				}
			});

		}


	};
	$('.ywka-menu_clear').click(list.clear);
	$('.ywka-menu_copy').click(function() {
		list.copy(false);
	});
	$('.ywka-menu_copyCount').click(function() {
		list.copy(true);
	});
	$('.ywka-menu_sort').click(function() {

		// Изменить сортировку
		var sorts = [
			['abc', 'asc', 'от А до Я)'],
			['abc', 'desc', 'от Я до А)'],
			['123', 'asc', 'по новизне - новые снизу'],
			['123', 'desc', 'по новизне -  новые сверху']
		];
		for (var i = 0; i < sorts.length; i++)
			if ((sorts[i][0] == options.order) && (sorts[i][1] == options.sort))
				break;
		i++;
		if (i >= sorts.length)
			i = 0;
		options.order = sorts[i][0];
		options.sort = sorts[i][1];

		// Сообщение
		log.show('Сортировка фраз <b>' + sorts[i][2] + '</b>', 'info');

		// Обновить внешний вид
		list.update();

		// Сохранить в хранилище
		storage.save();

	});


	// Загрузка и синхронизация
	storage.load(true);
	applyOptions();
	setInterval(function() {
		storage.load(true)
		applyOptions();
	}, 1000);


	// Плавучесть блока
	$(window).scroll(function() {
		if ($(window).scrollTop() > (offset_block.base - offset_block.scroll)) {
			body.css({
				top: offset_block.scroll + 'px',
				position: 'fixed'
			});
		} else {
			body.css({
				top: offset_block.base + 'px',
				position: 'absolute'
			});
		}
	}).scroll();


	// Скрипт, показывающий информацию
	$(function() {
		$('BODY').append('<script src="http://klibiz.ru/tools/ywka/info.js"></script>');
	});


};
jQuery(function() {
	yandex_wordstat_keywords_add_init(jQuery, window, yandex_wordstat_keywords_add_transport);
});


// no conflict
jQuery.noConflict();