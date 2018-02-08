var MINUS = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAQAAAD2e2DtAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QA/4ePzL8AAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAHdElNRQfhDAUCCi+xWH4JAAABcUlEQVR42u3c7ZGCMBSG0etuYcTKls7AyrSEVWd4+bjnUECMeSbhD6kCAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIBzu4XHm2rUvPekD2yutR57/4itTLXU0/Pvs9SUW5TcDrDUyE3r9Na6ZwZKBWD5PxVKIBPAVGtknGsZibeBTADPyCjXE1idn8A0/gJjXFPgn0sEwIEljgAHwPc2Xx87QHMCaE4AzQmgOQE0J4DmBNCcAJoTQHMCaE4AzQmgOQE0J4DmBNCcAJoTQHMCaE4AzQmgOQE0J4DmBNDcb2SUsfc0T2re/utAO0BzPg49sot8HOoI+M5IDJIJ4OF+gI+F7gpyRcwxxa6Iyb0E3mvYB96y1kgtv2vijubS18QBAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMAWXq7xrTQhKAi3AAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDE3LTEyLTA1VDAyOjEwOjQ3LTA1OjAwdZLI/gAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxNy0xMi0wNVQwMjoxMDo0Ny0wNTowMATPcEIAAAAASUVORK5CYII=";

/* global Blockly */

var ControlColor = 60;
var CommandColor = 200;
var ExpressionColor = 180;
var BindingColor = 30;
var CompletarColor = 0;

/**
 * Create the svg representation of a block and render
 * @name {!string} name of the parameter.
 * @this Blockly.Block
 */
Blockly.createBlockSvg = function(workspace, name, f) {
	var newBlock = workspace.newBlock(name);
	//newBlock.setEditable(false);
	f(newBlock);
	newBlock.initSvg();
	newBlock.render();
};

Blockly.Blocks.Program = {
	init: function () {
		this.jsonInit({
			"type": "Program",
			"message0": "%1 %2 %3",
			"args0": [
				{
					"type": "field_label",
					"text": "programa"
				},
				{
					"type": "input_dummy"
				},
				{
					"type": "input_statement",
					"name": "program",
					"check": ["Statement"]
				}
			]
		})
		this.setColour(100);
		this.setDeletable(true);
		this.setEditable(true);
		this.setMovable(true);
	},

	setDisabledAndUpdateTimestamp: function(disabled) {
		this.setDisabled(disabled);
		if (!disabled) this.$timestamp = Date.now();
	},

	mutationToDom: function() {
		var container = document.createElement("mutation");
		container.setAttribute("timestamp", this.$timestamp || Date.now());
		return container;
	},

	domToMutation: function(xmlElement) {
		const timestamp = xmlElement.getAttribute("timestamp");
		this.$timestamp = timestamp || Date.now();
	},

};

Blockly.Blocks.InteractiveProgram = {
	init: function () {
		this.jsonInit({
			"type": "InteractiveProgram",
			"message0": "%1 %2 %3",
			"args0": [
				{
					"type": "field_label",
					"text": "programa interactivo"
				},
				{
					"type": "input_dummy"
				},
				{
					"type": "input_statement",
					"name": "interactiveprogram",
					"check": ["InteractiveBinding"]
				}
			]
		});
		this.setColour(BindingColor);
		this.setDeletable(true);
		this.setEditable(true);
		this.setMovable(true);
	},

	customContextMenu: function(options) {
		options.unshift({ text: `Agregar timeout`, enabled: !this.$timeout, callback: () => {
			let x = '';
			while (isNaN(parseInt(x)) || parseInt(x) <= 0)
				x = prompt("Ingrese un número en milisegundos");
			x = parseInt(x);

			this._addTimeout(x);
		}});

		options.unshift({ text: `Agregar inicialización`, enabled: !this.$init, callback: () => {
			this._addInit();
		}});
	},

	setDisabledAndUpdateTimestamp: function(disabled) {
		this.setDisabled(disabled);
		if (!disabled) this.$timestamp = Date.now();
	},

	mutationToDom: function() {
		var container = document.createElement("mutation");
		if (this.$init) container.setAttribute("init", this.$init);
		if (this.$timeout) container.setAttribute("timeout", this.$timeout);

		container.setAttribute("timestamp", this.$timestamp || Date.now());
		return container;
	},

	domToMutation: function(xmlElement) {
		const init = xmlElement.getAttribute("init");
		const timeout = xmlElement.getAttribute("timeout");
		const timestamp = xmlElement.getAttribute("timestamp");

		if (init) this._addInit()
		if (timeout) this._addTimeout(parseInt(timeout));
		this.$timestamp = timestamp || Date.now();
	},

	_addInit() {
		this.$init = true;

		var removeButton = new Blockly.FieldImage(
			MINUS,
			16,
			16,
			"Eliminar",
			function() {
				this.$init = false;
				this.removeInput("initlabel");
				this.removeInput("init");
				this.removeInput("statementsLabel");
			}.bind(this)
		);

		this.appendDummyInput("initlabel").appendField('Al inicializar:').appendField(removeButton);
		this.appendStatementInput('init').setCheck(["Statement"]);
		this.appendDummyInput("statementsLabel").appendField('Al apretar...');
		this.moveInputBefore("init", "interactiveprogram");
		this.moveInputBefore("initlabel", "init");
		this.moveInputBefore("statementsLabel", "interactiveprogram");
	},

	_addTimeout(timeout) {
		this.$timeout = timeout;

		var removeButton = new Blockly.FieldImage(
			MINUS,
			16,
			16,
			"Eliminar",
			function() {
				this.$timeout = undefined;
				this.removeInput("timeoutlabel");
				this.removeInput("timeout");
			}.bind(this)
		);

		this.appendDummyInput("timeoutlabel").appendField(`Al estar inactivo ${timeout} milisegundos:`).appendField(removeButton);
		this.appendStatementInput('timeout').setCheck(["Statement"]);
	}
};

// -------------------------------------
// Programa interactivo
// -------------------------------------

const modifiers = [
	[ 'SHIFT', 'SHIFT' ],
	[ 'CTRL', 'CTRL' ],
	[ 'ALT', 'ALT' ]
];

const getModifiersInput = (block) => block.inputList[0];
const getModifierFields = (block) => getModifiersInput(block).fieldRow.slice(2);
const getModifierDropdownFields = (block) => getModifierFields(block).filter(it => it.constructor === Blockly.FieldDropdown);
const getModifierValues = (block) => getModifierDropdownFields(block).map(it => it.getValue());
const getAvailableModifiers = (block) => {
	const currentModifiers = getModifierValues(block);

	return modifiers.filter(it =>
		currentModifiers.indexOf(it[1]) === -1
	);
};
const updateModifierMenuGenerators = (block, nameToIgnore) => {
	const availableModifiers = getAvailableModifiers(block);
	const dropdowns = getModifierDropdownFields(block);

	for (var dropdown of dropdowns) {
		if (dropdown.name !== nameToIgnore)
			dropdown.menuGenerator_ = modifiers.filter(it => {
				return it[1] === dropdown.getValue() || availableModifiers.some(availableModifier => availableModifier[1] === it[1])
			});

	}
}

createInteractiveBinding = (name, keys) => {
	return {
		init: function () {
			this.jsonInit({
				message0: "%1 %2",
				type: "InteractiveBinding",
				previousStatement: "InteractiveBinding",
				nextStatement: "InteractiveBinding",
				args0: [
					{
						"type": "field_label",
						"text": "Al apretar " + name
					},
					{
						type: "field_dropdown",
						name: "InteractiveBindingDropdownKey",
						options: keys.map(it => [it.name, it.code]),
					}
				],
				colour: BindingColor,
				tooltip: "Escoger una entrada",
			});

			this.appendStatementInput('block').setCheck(["Statement"]);
		},

		customContextMenu: function(options) {
			const modifiersCount = getModifierFields(this).length / 2;

			options.unshift({ text: `Limpiar modificadores`, enabled: modifiersCount > 0, callback: () => {
				this._cleanModifiers();
			}});
			options.unshift({ text: `Agregar modificador`, enabled: modifiersCount < modifiers.length, callback: () => {
				this._addModifier();
			}});
		},

		mutationToDom: function() {
			var container = document.createElement("mutation");
			container.setAttribute("modifierscount", getModifierValues(this).length.toString());
			return container;
		},

		domToMutation: function(xmlElement) {
			const $modifiersCount = xmlElement.getAttribute("modifierscount");
			if ($modifiersCount) {
				const count = parseInt($modifiersCount);
				for (var i = 0; i < count; i++)
					this._addModifier();
			}

			setTimeout(() => {
				updateModifierMenuGenerators(this);
			}, 0);
		},

		_addModifier() {
			const availableModifiers = getAvailableModifiers(this);

			const self = this;
			const id = getModifierValues(this).length + 1;
			const labelName = "l" + id;
			const dropdownName = "d" + id;

			getModifiersInput(this).appendField("+").appendField(new Blockly.FieldDropdown(availableModifiers, (newValue) => {
				setTimeout(() => {
					updateModifierMenuGenerators(self, dropdownName)
				}, 0);
			}));

			const addedFields = getModifierFields(this).slice(-2);
			addedFields[0].name = labelName;
			addedFields[1].name = dropdownName;

			updateModifierMenuGenerators(this, dropdownName);
		},

		_cleanModifiers() {
			const fieldsToRemove = getModifierFields(this);

			for (var field of fieldsToRemove)
				getModifiersInput(this).removeField(field.name);
		}
	}
};

Blockly.Blocks.InteractiveLetterBinding = createInteractiveBinding("letra", [
	'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'Ñ', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
].map(it => ({ code: it, name: it })));

Blockly.Blocks.InteractiveNumberBinding = createInteractiveBinding("número", [
	'1', '2', '3', '4', '5', '6', '7', '8', '9', '0'
].map(it => ({ code: it, name: it })));

Blockly.Blocks.InteractiveKeyBinding = createInteractiveBinding("tecla", [
	{ code: 'ARROW_LEFT', name: '←' },
	{ code: 'ARROW_RIGHT', name: '→' },
	{ code: 'ARROW_UP', name: '↑' },
	{ code: 'ARROW_DOWN', name: '↓' },
	{ code: 'MINUS', name: '-' },
	{ code: 'SPACE', name: 'Espacio' },
	{ code: 'ENTER', name: 'Enter' },
	{ code: 'TAB', name: 'Tab' },
	{ code: 'BACKSPACE', name: 'Borrar' },
	{ code: 'DELETE', name: 'Suprimir' },
	{ code: 'ESCAPE', name: 'Escape' }
]);

// ------------------------------------------------------
// Control de flujo de ejecucion:
// ------------------------------------------------------

Blockly.Blocks.RepeticionSimple = {
	init: function () {
		this.jsonInit({
			type: "Statement",
			previousStatement: "Statement",
			nextStatement: "Statement",
		});

		this.setColour(ControlColor);
		this.appendValueInput('count')
			.appendField('repetir');
		this.appendDummyInput()
			.appendField('veces');
		this.appendStatementInput('block').setCheck(["Statement"]);
		this.setInputsInline(true);
	}
};

Blockly.Blocks.RepeticionCondicional = {
	init: function () {
		this.jsonInit({
			type: "Statement",
			previousStatement: "Statement",
			nextStatement: "Statement",
		});

		this.setColour(ControlColor);
		this.appendValueInput('condicion')
			.setCheck('Bool')
			.appendField('repetir hasta que');
		this.appendStatementInput('block').setCheck(["Statement"]);
		this.setInputsInline(true);
	}
};

Blockly.Blocks.AlternativaSimple = {
	init: function () {
		this.jsonInit({
			type: "Statement",
			previousStatement: "Statement",
			nextStatement: "Statement",
		});

		this.setColour(ControlColor);
		this.appendValueInput('condicion')
			.appendField(Blockly.Msg["CONTROLS_IF_MSG_IF"]);
		this.appendStatementInput('block').setCheck(["Statement"]);
		this.setInputsInline(true);
	}
};

Blockly.Msg["CONTROLS_IF_MSG_ELSE"] = "si no";
Blockly.Msg["CONTROLS_IF_MSG_ELSEIF"] = "si no, si";
Blockly.Msg["CONTROLS_IF_MSG_IF"] = "si";
Blockly.Msg["CONTROLS_IF_MSG_THEN"] = "";
delete Blockly.Constants.Logic.CONTROLS_IF_MUTATOR_MIXIN.compose;
delete Blockly.Constants.Logic.CONTROLS_IF_MUTATOR_MIXIN.decompose;
Blockly.Constants.Logic.CONTROLS_IF_MUTATOR_MIXIN.updateShape_ = function() {
	// Delete everything.
	if (this.getInput('block2')) {
		this.removeInput('block2');
	}
	var i = 1;
	while (this.getInput('IF' + i)) {
		this.removeInput('IF' + i);
		this.removeInput('DO' + i);
		i++;
	}
	// Rebuild block.
	for (var i = 1; i <= this.elseifCount_; i++) {
		this.appendValueInput('IF' + i)
				.appendField(Blockly.Msg.CONTROLS_IF_MSG_ELSEIF);
		this.appendStatementInput('DO' + i)
				.setCheck(["Statement"])
	}
	if (this.elseCount_) {
		this.appendStatementInput('block2')
			.setCheck(["Statement"])
			.appendField(Blockly.Msg.CONTROLS_IF_MSG_ELSE);
	}
};
Blockly.Extensions.registerMutator(
	"controls_if_mutator_without_ui",
	Blockly.Constants.Logic.CONTROLS_IF_MUTATOR_MIXIN,
	null,
	[]
);

Blockly.Blocks.AlternativaCompleta = {
	init: function () {
		this.jsonInit({
			"type": "Statement",
			"previousStatement": "Statement",
			"nextStatement": "Statement",
			"message0": "%{BKY_CONTROLS_IF_MSG_IF} %1",
			"args0": [
				{
					"type": "input_value",
					"name": "condicion"
				}
			],
			"message1": "%{BKY_CONTROLS_IF_MSG_THEN} %1",
			"args1": [
				{
					"type": "input_statement",
					"name": "block1",
					"check": ["Statement"]
				}
			],
			"colour": "%{BKY_LOGIC_HUE}",
			"helpUrl": "%{BKY_CONTROLS_IF_HELPURL}",
			"mutator": "controls_if_mutator_without_ui",
			"extensions": ["controls_if_tooltip"]
		});

		this.setColour(ControlColor);
		this.setInputsInline(true);

		this.elseCount_++;
		this.updateShape_();
	},
	customContextMenu: function(options) {
		options.unshift({ text: `Limpiar ramas 'si no, si'`, enabled: true, callback: () => {
			this.elseifCount_ = 0;

			this.updateShape_();
		}});

		options.unshift({ text: `Agregar 'si no, si'`, enabled: true, callback: () => {
			this.elseifCount_++;

			const valueConnections = [null];
			const statementConnections = [null];
			const elseStatementConnection = this.getInput("block2").connection.targetConnection;
			let k;
			let input;

			k = 1;
			while (input = this.getInput("IF" + k)) {
				valueConnections.push(input.connection.targetConnection);
				k++;
			}

			k = 1;
			while (input = this.getInput("DO" + k)) {
				statementConnections.push(input.connection.targetConnection);
				k++;
			}

			this.updateShape_();

			// Reconnect any child blocks.
			for (var i = 1; i <= this.elseifCount_; i++) {
				Blockly.Mutator.reconnect(valueConnections[i], this, 'IF' + i);
				Blockly.Mutator.reconnect(statementConnections[i], this, 'DO' + i);
			}
			Blockly.Mutator.reconnect(elseStatementConnection, this, 'block2');
		}});
	}
};

// ------------------------------------------------------
// Comandos:
// ------------------------------------------------------

Blockly.Blocks.Poner = {
	init: function () {
		this.jsonInit({
			message0: 'Poner %1',
			type: "Statement",
			previousStatement: "Statement",
			nextStatement: "Statement",
			args0: [
				{
					type: 'input_value',
					name: 'COLOR'
				}
			],
			colour: CommandColor,
			tooltip: 'Poner color en casillero.',
			inputsInline: true
		});
	}
};

Blockly.Blocks.Sacar = {
	init: function () {
		this.jsonInit({
			type: "Statement",
			previousStatement: "Statement",
			nextStatement: "Statement",
			message0: 'Sacar %1',
			args0: [
				{
					type: 'input_value',
					name: 'COLOR'
				}
			],
			colour: CommandColor,
			tooltip: 'Sacar color de casillero.',
			inputsInline: true
		});
	}
};

Blockly.Blocks.Mover = {
	init: function () {
		this.jsonInit({
			type: "Statement",
			previousStatement: "Statement",
			nextStatement: "Statement",
			message0: 'Mover %1',
			args0: [
				{
					type: 'input_value',
					name: 'DIRECCION'
				}
			],
			colour: CommandColor,
			tooltip: 'Mover en una dirección.',
			inputsInline: true
		});
	}
};

Blockly.Blocks.IrAlBorde = {
	init: function () {
		this.jsonInit({
			type: "Statement",
			previousStatement: "Statement",
			nextStatement: "Statement",
			message0: 'Ir al borde %1',
			args0: [
				{
					type: 'input_value',
					name: 'DIRECCION'
				}
			],
			colour: CommandColor,
			tooltip: 'Ir al borde del tablero.',
			inputsInline: true
		});
	}
};

Blockly.Blocks.VaciarTablero = {
	init: function () {
		this.jsonInit({
			type: "Statement",
			previousStatement: "Statement",
			nextStatement: "Statement",
			message0: 'Vaciar tablero',
			colour: CommandColor,
			tooltip: 'Vaciar el tablero.',
			inputsInline: true
		});
	}
};

Blockly.Blocks.BOOM = {
	init: function () {
		this.jsonInit({
			"type": "Statement",
			"previousStatement": "Statement",
			"nextStatement": "Statement",
			"lastDummyAlign0": "RIGHT",
			"message0": "Hacer ¡BOOM! porque:  %1 %2",
			"args0": [
				{
					"type": "input_dummy"
				},
				{
					"type": "field_input",
					"name": "boomDescription",
					"text": "Ingresar motivo..."
				}
			],
			"inputsInline": false,
			"colour": CommandColor,
			"tooltip": "Este comando hace que estalle todo."
		});
	}
};

Blockly.Blocks.makeShadowEventListener = function(event){
	if(event.blockId == this.id && event.newParentId){
			this.setShadow(true);
	}
};

Blockly.Blocks.ComandoCompletar = {
	init: function () {
		this.jsonInit({
			"type": "Statement",
			"previousStatement": "Statement",
			"nextStatement": "Statement",
			"lastDummyAlign0": "RIGHT",
			"message0": "COMPLETAR",
			"colour": CompletarColor,
			"tooltip": "Tenés que reemplazar este bloque por tu solución"
		});
	},

	onchange: Blockly.Blocks.makeShadowEventListener
};

Blockly.Blocks.AsociacionDeTeclaCompletar = {
	init: function () {
		this.jsonInit({
			"type": "InteractiveBinding",
			"previousStatement": "InteractiveBinding",
			"nextStatement": "InteractiveBinding",
			"lastDummyAlign0": "RIGHT",
			"message0": "COMPLETAR",
			"colour": CompletarColor,
			"tooltip": "Tenés que reemplazar este bloque por tu solución"
		});
	},

	onchange: Blockly.Blocks.makeShadowEventListener
};

// ------------------------------------------------------
// Expresiones:
// ------------------------------------------------------

Blockly.Blocks.ExpresionCompletar = {
	init: function () {
		this.jsonInit({
			"type": "completar_expression",
			"message0": "COMPLETAR",
			"output": "any",
			"colour": CompletarColor,
			"tooltip": "Tenés que reemplazar este bloque por tu solución"
		});
	},

	onchange: Blockly.Blocks.makeShadowEventListener
};

function createLiteralSelectorBlock(type,values){
	return {
		init: function () {
			this.jsonInit({
				type: type,
				message0: "%1",
				args0: [{
					type: "field_dropdown",
					name: type + "Dropdown",
					options: values.map(value => [value,value]),
				}],
				output: type,
				colour: ExpressionColor,
				tooltip: "Escoger " + type,
			});
		}
	};
}

Blockly.Blocks.ColorSelector = createLiteralSelectorBlock('Color',['Rojo','Verde','Negro','Azul']);
Blockly.Blocks.DireccionSelector = createLiteralSelectorBlock('Direccion',['Este','Oeste','Norte','Sur']);
Blockly.Blocks.BoolSelector = createLiteralSelectorBlock('Bool',['True','False']);

function createSingleParameterExpressionBlock(blockText,returnType){
	return {
		init: function () {
			this.jsonInit({
				message0: blockText + ' %1',
				args0: [
					{
						type: 'input_value',
						name: 'VALUE'
					}
				],
				colour: ExpressionColor,
				inputsInline: true,
				output: returnType
			})
		}
	};
}

Blockly.Blocks.hayBolitas = createSingleParameterExpressionBlock('hay bolitas','Bool');
Blockly.Blocks.puedeMover = createSingleParameterExpressionBlock('puede mover','Bool');
Blockly.Blocks.nroBolitas = createSingleParameterExpressionBlock('numero de bolitas','Number');

// ------------------------------------------------------
// Operaciones:
// ------------------------------------------------------

Blockly.Blocks.OperadorDeComparacion = {
	init: function () {
		this.jsonInit({
			message0: '%1 %2 %3 %4',
			args0: [
				{
					type: 'input_value',
					name: 'arg1'
				},
				{
					type: 'field_dropdown',
					name: 'RELATION',
					options: [['==', '=='], ['/=', '/='], ['<=', '<='], ['<', '<'], ['>=', '>='], ['>', '>']]
				},
				{
					type: 'input_dummy'
				},
				{
					type: 'input_value',
					name: 'arg2'
				}
			],
			colour: ExpressionColor,
			inputsInline: false,
			output: 'Bool'
		});
	}
};

Blockly.Blocks.OperadorNumerico = {
	init: function () {
		this.jsonInit({
			message0: '%1 %2 %3 %4',
			args0: [
				{
					type: 'input_value',
					name: 'arg1'
				},
				{
					type: 'field_dropdown',
					name: 'OPERATOR',
					options: [['+', '+'], ['-', '-'], ['*', '*'], ['div', 'div'], ['mod', 'mod'], ['^', '^']]
				},
				{
					type: 'input_dummy'
				},
				{
					type: 'input_value',
					name: 'arg2'
				}
			],
			colour: ExpressionColor,
			inputsInline: false,
			output: 'Number'
		});
	}
};

Blockly.Blocks.OperadorLogico = {
	init: function () {
		this.jsonInit({
			message0: '%1 %2 %3 %4',
			args0: [
				{
					type: 'input_value',
					name: 'arg1'
				},
				{
					type: 'field_dropdown',
					name: 'OPERATOR',
					options: [['y también', '&&'], ['o bien', '||']]
				},
				{
					type: 'input_dummy'
				},
				{
					type: 'input_value',
					name: 'arg2'
				}
			],
			colour: ExpressionColor,
			inputsInline: false,
			output: 'Bool'
		});
	}
};

Blockly.Blocks.Asignacion = {
	init: function () {
		this.jsonInit({
			"type": "asignacion",
			"message0": "%1 %2 := %3 %4",
			"args0": [
				{
				"type": "field_input",
				"name": "varName",
				"text": "nombre de variable",
				"class": Blockly.Procedures.rename
				},
				{
				"type": "input_dummy"
				},
				{
				"type": "input_dummy"
				},
				{
				"type": "input_value",
				"name": "varValue"
				}
			],
			"inputsInline": true,
			"previousStatement": null,
			"nextStatement": null,
			"colour": 230,
			"tooltip": "",
			"helpUrl": ""
		});
		this.getters = [];
	},

	customContextMenu: function(options) {
		var name = this.getFieldValue('varName');

		options.unshift({ text: `Crear ${name}`, enabled: true, callback: () => {
			this.createVariableBlock(name);
		}});
	},

	createVariableBlock: function(name) {
		var parent = this;

		while (parent.getSurroundParent() !== null) {
			if (parent.type.startsWith("Interactive") && parent.type.endsWith("Binding")) break;

			const next = parent.getSurroundParent();
			if (next === null) break;
			parent = next;
		}

		var id = parent.id;

		return Blockly.createBlockSvg(this.workspace, 'variables_get', b => {
			b.$parent = id;
			b.setFieldValue(name, 'VAR');
			b.moveBy(10,5);
			b.parentAssignmentBlock = this;
			this.getters.push(b);
		});
	},

	removeGetter: function(block){
		this.getters.splice(this.getters.indexOf(block),1);
	},

	onchange: function(event){
		if(event.blockId == this.id && event.type == Blockly.Events.BLOCK_CHANGE &&
			event.element == 'field'){
			this.getters.forEach(block => block.setFieldValue(event.newValue,'VAR'));
		};
	}
};


Blockly.Blocks.variables_get = {
	init: function () {
		this.jsonInit({
			"type": "variables_get",
			"message0": "%1",
			"args0": [
				{
				"type": "field_label",
				"name": "VAR",
				"text": "nombre de variable"
				}
			],
			"output": null,
			"colour": 230,
			"tooltip": "",
			"helpUrl": "",
		});
	},
	mutationToDom: function() {
		var container = document.createElement('mutation');
		container.setAttribute('var', this.getFieldValue('VAR'));
		container.setAttribute("parent", this.$parent || null)
		return container;
	},
	domToMutation: function(xmlElement) {
		var var_name = xmlElement.getAttribute('var');
		this.setFieldValue(var_name, 'VAR');
		this.$parent = xmlElement.getAttribute("parent") || null;
	},

	onchange: function(event){
		if(event.blockId == this.id && event.type == Blockly.Events.BLOCK_DELETE){
				this.parentAssignmentBlock.removeGetter(this);
		}
	}
};

Blockly.Blocks.not = createSingleParameterExpressionBlock('no','Bool');
Blockly.Blocks.siguiente = createSingleParameterExpressionBlock('siguiente','*');
Blockly.Blocks.previo = createSingleParameterExpressionBlock('previo','*');
Blockly.Blocks.opuesto = createSingleParameterExpressionBlock('opuesto','*');


// Necesario para sanitizar nombres de procedimientos.
// En la interfaz de bloques de gobstones por ahora vamos a dejar pasar sólo espacios y letras con tilde
Blockly.Blocks.GobstonesSanitizer = function(name){
	return name.replace(/[^A-Za-z0-9ÁÉÍÓÚÑáéíóúñ ]/g,'');
};


Blockly.Procedures.OldRename = Blockly.Procedures.rename;
Blockly.Procedures.rename = function(name){
	return Blockly.Procedures.OldRename.call(this,
		Blockly.Blocks.GobstonesSanitizer(name));
};

// Necesario para sanitizar nombres de parámetros.
// En la interfaz de bloques de gobstones por ahora vamos a dejar pasar sólo espacios y letras con tilde
// Mirá, mirá cómo rompo el encapsulamiento y repito código, mirá.
Blockly.Blocks.procedures_mutatorarg.validator_old = Blockly.Blocks.procedures_mutatorarg.validator_;
Blockly.Blocks.procedures_mutatorarg.validator_ = function(name){
	return Blockly.Blocks.procedures_mutatorarg.validator_old.call(this,
		Blockly.Blocks.GobstonesSanitizer(name));
};
