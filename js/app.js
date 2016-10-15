'use strict';
var PasswordBox = React.createClass({
	getInitialState: function() {
		return {data: []};
	},

	handlePasswordSubmit: function() {
		// submit changes to server for back-end validation and DB persistence
		return;
	},

	render: function() {
		return (
			<div className="passwordBox">
				<PasswordForm onPasswordSubmit={this.handlePasswordSubmit} />
			</div>
		);
	}
});

var PasswordForm = React.createClass({

	getInitialState: function() {
		return {
			password1: '',
			password2: '',
			message: ''
		};
	},

	handleSubmit: function(e) {
		e.preventDefault();
		var password1 = this.state.password1.trim();
		var password2 = this.state.password2.trim();

		if (!password1 || !password2) {
			this.setState({message: 'Please fill out all password fields'});
			return;
		}

		if (password1 != password2) {
			this.setState({message: 'The new passwords you entered do not match'});
			return;
		}

		this.props.onPasswordSubmit({password1: password1, password2: password2});
		this.refs.password1.state.value = '';
		this.refs.password2.state.value = '';
		this.setState({
			password1: '',
			password2: '',
			message: 'Your password was successfully changed'
		});
	},

	validatePassword: function (value) {
		var re = /^.{8,20}$/;
		return re.test(value);
	},

	handlePassword1Change: function(e) {
		this.setState({
			password1: e.target.value,
			message: ''
		});
	},

	handlePassword2Change: function(e) {
		this.setState({
			password2: e.target.value,
			message: ''
		});
	},

	render: function() {
		return (
			<form className="passwordForm" onSubmit={this.handleSubmit}>
				<fieldset>
					<legend>&nbsp;Change Password&nbsp;</legend>
					<PasswordMessage message={this.state.message} />

					<label htmlFor="password1">New Password</label>
					<TextInput
						id="password1"
						ref="password1"
						autoFocus={true}
						type="password"
						placeholder="new password"
						uniqueClassName="password1"
						onChange={this.handlePassword1Change}
						required={true}
						minCharacters={8}
						maxCharacters={20}
						nowhitespace={true}
						oneletter={true}
						onenumber={true}
						onespecial={true}
						validate={this.validatePassword}
						errorMessage="Password is invalid"
						emptyMessage="Password is required" />

					<label htmlFor="password2">Confirm Password</label>
					<TextInput
						id="password2"
						ref="password2"
						autoFocus={false}
						type="password"
						placeholder="confirm password"
						uniqueClassName="password2"
						onChange={this.handlePassword2Change}
						required={true}
						minCharacters={8}
						maxCharacters={20}
						nowhitespace={true}
						oneletter={true}
						onenumber={true}
						onespecial={true}
						validate={this.validatePassword}
						errorMessage="Password is invalid"
						emptyMessage="Password is required" />

					<input
						type="submit"
						value="Change"
						className="floatRight"
					 />
				</fieldset>
			</form>
		);
	}
});

var PasswordMessage = React.createClass({
  render: function() {
	return (
		<div className="passwordMessage">
			{this.props.message}
		</div>
	);
  }
});

var TextInput = React.createClass({
	getInitialState: function(){
		return {
			value: null,
			isEmpty: true,
			valid: false,
			errorMessage: "",
			errorVisible: false
		};
	},

	nowhitespace: function (value) {
		var re = /^\S+$/i;
		return re.test(value);
	},

	oneletter: function (value) {
		var re =  /[a-z]/i;
		return re.test(value);
	},

	onenumber: function (value) {
		var re =  /[0-9]/i;
		return re.test(value);
	},

	onespecial: function (value) {
		var re =  /[;|:|@|!|$|##|%|^|&|*|(|)|_|-|+|=|\'|\\|\||{|}|?|/|,|.]/i;
		return re.test(value);
	},

	validation: function (value, valid) {
		if (typeof valid === 'undefined') {
			valid = true;
		}

		var message = "";
		var errorVisible = false;

		if (!valid) {
			message = this.props.errorMessage;
			valid = false;
			errorVisible = true;

		} else if (this.props.required && jQuery.isEmptyObject(value)) {
			message = "Password is required";
			valid = false;
			errorVisible = true;

		} else if (value.length > this.props.maxCharacters) {
			message = "Must be less than " + this.props.maxCharacters + " characters long";
			valid = false;
			errorVisible = true;

		} else if (!this.nowhitespace(value)) {
			message = "No white space please";
			valid = false;
			errorVisible = true;

		} else if (!this.oneletter(value)) {
			message = "Must contain at least one letter";
			valid = false;
			errorVisible = true;

		} else if (!this.onenumber(value)) {
			message = "Must contain at least one number";
			valid = false;
			errorVisible = true;

		} else if (!this.onespecial(value)) {
			message = "Must contain one special character";
			valid = false;
			errorVisible = true;

		} else if (value.length < this.props.minCharacters) {
			message = "Must be at least " + this.props.minCharacters + " characters long";
			valid = false;
			errorVisible = true;
		}

		this.setState({
			value: value,
			isEmpty: jQuery.isEmptyObject(value),
			valid: valid,
			errorMessage: message,
			errorVisible: errorVisible
		});
	},

	handleBlur: function (e) {
		var valid = this.props.validate(e.target.value);
		this.validation(e.target.value, valid);
	},

	handleChange: function(e){
		this.validation(e.target.value);

		if (this.props.onChange) {
			this.props.onChange(e);
		}
	},

	render: function() {
		return (
			<div className={this.props.uniqueClassName}>
				<input
					id={this.props.id}
					ref={this.props.ref}
					autoFocus={this.props.autoFocus}
					type={this.props.type}
					placeholder={this.props.placeholder}
					className={'input input-' + this.props.uniqueClassName}
					onChange={this.handleChange}
					onBlur={this.handleBlur}
					value={this.state.value} />

				<InputError
					visible={this.state.errorVisible}
					errorMessage={this.state.errorMessage} />
			</div>
		);
	}
});

var InputError = React.createClass({
	getInitialState: function() {
		return {
			message: 'Input is invalid'
		};
	},
	render: function(){
		var errorClass = classNames(this.props.className, {
			'error_container': true,
			'visible': this.props.visible,
			'invisible': !this.props.visible
		});

		return (
			<div className={errorClass}>
				<span>{this.props.errorMessage}</span>
			</div>
		)
	}
});

ReactDOM.render(
	<PasswordBox />,
	document.getElementById('container')
);
