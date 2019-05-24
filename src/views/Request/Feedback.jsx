import React, { Component } from 'react';

import { BFLOWDataService } from "../../configuration/services/BFLOWDataService";
import './Feedback.css';

class Feedback extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      Value: '',
      Comments: '',
      rating: null,
      temp_rating: null,
      isShowButton: null,
      showFeedBack: false,
    };
  }
  componentDidMount() {
    const { Feedbackvalue } = this.props;
    this.setState({ rating: Feedbackvalue, isShowButton: Feedbackvalue })
  }
  componentWillReceiveProps(nextProps) {
    const { Feedbackvalue } = nextProps;
    if (Feedbackvalue !== null || Feedbackvalue !== undefined) {
      this.setState({ rating: Feedbackvalue, isShowButton: Feedbackvalue })
    }


  }
  async Feedback() {
    const responseJson = await BFLOWDataService.get("Feedback");
    this.setState({ feedback: responseJson });

  }
  async AddFeedback() {

    const body = JSON.stringify({
      Comments: this.state.Comments,
      requestId: this.props.RequestId,
      Value: this.state.rating,
    });
    const response = await BFLOWDataService.post('Feedback', body);

    this.props.submitFeedBack()


  }



  starRating(rating) {
    this.setState({
      rating: rating,
      temp_rating: rating
    });
  }
  star_over(rating) {

    this.state.temp_rating = this.state.rating;
    this.state.rating = rating;
    this.setState({
      rating: this.state.rating,
      temp_rating: this.state.temp_rating
    });
  }

  star_out() {
    this.state.rating = this.state.temp_rating;
    this.setState({ rating: this.state.rating });
  }
  back() {

    this.props.href()
  }

  showSubmit() {
    
    const { submitFeedBack } = this.props;
    if (this.state.isShowButton === null) {
      return (
        <button
          type="button"
          class="common-button btn btn-dark float-right mr-2 mb-2"
          onClick={this.AddFeedback.bind(this)}
          disabled={this.state.rating<1} 
        >
          Submit
        </button>
      );
    }
  }


  /*Method to handle change event of all elements*/
  handleChange(event) {
    const { name, value } = event.target;
    this.setState({ [name]: value })
  }
  render() {
    var stars = [];
    debugger
    for (var i = 1; i <= 5; i++) {
      var klass = 'star-rating__star';
      if (this.state.rating >= i && this.state.rating != null ) {
        klass += ' is-selected';
      }
      stars.push(
        <label
          className={klass}
          value={this.state.rating}
          onClick={this.starRating.bind(this, i)}
          onMouseOver={this.star_over.bind(this, i)}
          onMouseOut={this.star_out.bind(this)}
        >
          ★
        </label>
      );
    }
    const { href } = this.props;
    return (
      <>
        <div class="card rounded-0 border-0 shadow-sm p-1 bg-white" style={{ height: "70vh" }}>
          <div className="padding123" style={{ height: "12vh" }}>
            <a onClick={href} class="fa fa-arrow-left" id="btnSubmitfeedback" style={{ cursor: 'pointer' }} >Submit feedback</a>
          </div>
          <div class="text-center" style={{ height: "15vh" }}>
            <div >
              <label>
                Please rate my work related to this request </label>
            </div>
            <div className="rounded-div" >
              {stars}
            </div>
          </div>
          <div className="padding123" >
            <div class="form-group">
              <label for="textAreaDescription1" >Comments or Suggestions if any</label>
              <textarea
                class="form-control"
                maxLength="250"
                placeholder="Enter Your Comments here"
                onChange={this.handleChange.bind(this)}
                value={this.state.Comments}
                name="Comments"
                id="Comments"
              />
            </div>
          </div>

        </div>
        <div class="card-footer bg-white">
          {this.showSubmit()}
          <button
            type="button"
            class=" btn btn-light float-right mr-4 mb-2"
            onClick={this.back.bind(this)}
          >
            Cancel
          </button>
        </div>

      </>
    );
  }
}
export default Feedback;