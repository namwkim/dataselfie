import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {createOption, updateOption, deleteOption, makeGetOptions} from 'ducks/options';
import {updateQuestion} from 'ducks/questions';
import {makeGetOptionDrawings} from 'ducks/drawings';
import {selectOption} from 'ducks/ui';
import TextField from 'components/TextField';
import Button from 'components/Button';
import css from './index.css';
class Question extends Component {
	constructor(props){
		super(props);

		this.handleCreateOption = this.handleCreateOption.bind(this);
		this.editDrawing = this.editDrawing.bind(this);
		this.handleQuestionChange = this.handleQuestionChange.bind(this);
	}
	componentDidMount(){
		if(!this.props.selectedOption && this.props.options.length>0){
			this.props.selectOption(this.props.options[0].id);
		}
	}
	componentDidUpdate(){
		if(!this.props.selectedOption && this.props.options.length>0){
			this.props.selectOption(this.props.options[0].id);
		}
	}
	handleCreateOption(){
		this.props.createOption(this.props.questionId, '');
	}
	handleDeleteOption(optionId){
		if (this.props.selectedOption==optionId){// change 
			let index = this.props.options.findIndex(o=>o.id==optionId);
			if (index+1<this.props.options.length){
				this.props.selectOption(this.props.options[index+1].id);
			}else if (index-1>=0){
				this.props.selectOption(this.props.options[index-1].id);
			}else{
				this.props.selectOption(null);
			}
		}
		this.props.deleteOption(optionId);

	}
	handleOptionChange(id, event){
		// let index = parseInt(event.target.dataset.index);
		this.props.updateOption(id,{text: event.target.value});
	}
	
	editDrawing(id){
		this.props.selectOption(id);
		
	}

	handleQuestionChange(event){
		this.props.updateQuestion(this.props.questionId, {text:event.target.value});
	}
	render() {
		return (
			<div>
			
								
				<div className={css.question}>
					<TextField placeholder='Question' 
						value={this.props.text} 
						onChange={this.handleQuestionChange}/>
				</div>
								
				<div className={css.options}>
					{this.props.options.map((option)=>
						<div key={option.id} className={css.option}>											
							<TextField placeholder='Option' 
								style={{width:'100%'}} 
								value={option.text} 
								onChange={this.handleOptionChange.bind(this,option.id)}/>	
							<Button className={this.props.selectedOption==option.id?css.selectedOption:undefined} 
								onPointerUp={this.editDrawing.bind(this,option.id)} outlined>
								<i className="fas fa-edit"></i>
							</Button>
							<Button onPointerUp={this.handleDeleteOption.bind(this,option.id)} outlined>
								<i className="fas fa-times"></i>
							</Button>
						</div>
					)}
									
				</div>
				<Button onPointerUp={this.handleCreateOption} outlined>Add Option</Button>
			</div>
		);
	}
}

Question.propTypes = {
	questionId:PropTypes.string,
	text:PropTypes.string,
	options:PropTypes.array,
	drawings:PropTypes.array,
	selectedOption:PropTypes.string,
	selectOption:PropTypes.func,
	createOption:PropTypes.func,
	deleteOption:PropTypes.func,
	updateOption:PropTypes.func,
	updateQuestion:PropTypes.func,
};

const getOptions = makeGetOptions();
const getDrawings = makeGetOptionDrawings(getOptions);
const mapStateToProps = (state, ownProps) => {
	let question = state.questions[ownProps.questionId];
	let options = getOptions(state, ownProps);

	let drawings = getDrawings(state, ownProps);
	console.log('question', drawings);
	return {
		...question,
		options,
		drawings,
		selectedOption:state.ui.selectedOption
	};
};

const mapDispatchToProps = (dispatch) => { 	
	return bindActionCreators({
		createOption,
		deleteOption,
		updateOption,
		selectOption,
		updateQuestion
	}, dispatch);
};

export default connect(mapStateToProps,mapDispatchToProps)(Question);
