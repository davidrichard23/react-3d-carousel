import React, { Component } from 'react';
import styled from 'styled-components'
import {detect} from 'detect-browser'

const browser = detect().name

const ANIMATION_DURATION = 1000

const Container = styled.div`
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
`

const PaneWrapper = styled.div`
  position: absolute;
  top: 0; left: 0;
  perspective: 1000px;
  perspective-origin: ${props => (browser == 'safari' || browser == 'ios') ? '50%' : props.xDirection} 50%; // for some reason safari requires the x origin to be centered while other browsers require it to be offset to the left or right
  width: 100%;
  height: 100%;
  z-axis: ${props => props.paneXIndex === props.centerXIndex ? 1 : -1};
  transform-origin: ${props => props.xDirection} center;
  transform-style:preserve-3d;
  transition: transform ${props => props.animationDuration}ms ease;
  transform: translateX(${props => getWrapperXTranslation(props)}vw);
`

const Pane = styled.div`
  display: flex;
  justify-content: center;
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  background-color: ${props => props.backgroundColor};
  transform-origin: ${props => props.xDirection} center;
  transition: transform ${props => props.animationDuration}ms ease;
  transform: rotateY(${props => {
    if (props.isAnimating && props.centerXIndex === props.paneXIndex) return props.xDirection === 'left' ? 90 : -90
    else return 0
  }}deg);
`

const LeftButton = styled.button`
  position: absolute;
  top: 0; left: 0; bottom: 0;
  width: 15vw;
  min-width: 100px;
  background-color: rgba(0,0,0,0);
  border-style: none;
  outline-style: none;
  color: white;
  cursor: pointer;
  transform: rotateZ(180deg);
  fill: white;
  // background: linear-gradient(to left, rgba(0,0,0,0) , rgba(0,0,0,1));
  z-index: 1000;
`
const RightButton = styled.button`
  position: absolute;
  top: 0; right: 0; bottom: 0;
  width: 15vw;
  min-width: 100px;
  background-color: rgba(0,0,0,0);
  border-style: none;
  outline-style: none;
  color: white;
  cursor: pointer;
  fill: white;
  // background: linear-gradient(to right, rgba(0,0,0,1) , rgba(0,0,0,0));
  z-index: 1000;
`

const Arrow = styled.img`
  width: 50px;
  height: 200px;
  float: right;
  padding-right: 10px;
`



function getWrapperXTranslation(props) {

  if (props.isAnimating) {
      if (props.paneXIndex === props.centerXIndex) {
        if (props.xDirection === 'left') return 100
        else return -100 
      }
      else {
        if (props.xDirection === 'left' && props.paneXIndex === props.leftXIndex) return 0
        else if (props.xDirection === 'right' && props.paneXIndex === props.rightXIndex) return 0
        else {
          if (props.paneXIndex === props.leftXIndex) return -100
          else if (props.paneXIndex === props.rightXIndex) return 100
        }
      }
    }
    else {
      if (props.paneXIndex !== props.centerXIndex) {
        if (props.paneXIndex === props.leftXIndex) return -100
        else if (props.paneXIndex === props.rightXIndex) return 100
      }
      else return 0
    }
}



export default class Carousel3D extends Component {

  constructor(props) {
    super(props);
  
    this.state = {
      isAnimating: false,
      xDirection: 'left',
      elementXIndex: 0,
      centerXIndex: 0,
      leftXIndex: 2,
      rightXIndex: 1,

      animationDuration: ANIMATION_DURATION,
      windowHeight: 0,
      windowWidth: 0,
    };
  }

  componentWillMount() {
    this.updateDimensions();
  }
  componentDidMount() {
    this.updateDimensions();
    window.addEventListener("resize", this.updateDimensions.bind(this))
  }
  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions.bind(this));
  }
  updateDimensions() {
    this.setState({windowHeight: window.innerHeight, windowWidth: window.innerWidth})
  }

  render() {

    const {centerXIndex, leftXIndex, rightXIndex, elementXIndex} = this.state
    const elements = this.props.elements || ['Pane #1', 'Pane #2', 'Pane #3']

    const leftElementIndex = elementXIndex === 0 ? elements.length - 1 : elementXIndex - 1
    const rightElementIndex = elementXIndex === elements.length - 1 ? 0 : elementXIndex + 1

    const content1 = centerXIndex === 0 && elements[elementXIndex] || leftXIndex === 0 && elements[leftElementIndex] || rightXIndex === 0 && elements[rightElementIndex]
    const content2 = centerXIndex === 1 && elements[elementXIndex] || leftXIndex === 1 && elements[leftElementIndex] || rightXIndex === 1 && elements[rightElementIndex]
    const content3 = centerXIndex === 2 && elements[elementXIndex] || leftXIndex === 2 && elements[leftElementIndex] || rightXIndex === 2 && elements[rightElementIndex]

    return (
      <Container>
        <PaneWrapper 
          isAnimating={this.state.isAnimating}  
          xDirection={this.state.xDirection} 
          paneXIndex={0} 
          centerXIndex={this.state.centerXIndex} 
          leftXIndex={this.state.leftXIndex} 
          rightXIndex={this.state.rightXIndex} 
          animationDuration={this.state.animationDuration}
        >
          <Pane 
            isAnimating={this.state.isAnimating} 
            xDirection={this.state.xDirection} 
            paneXIndex={0} 
            centerXIndex={this.state.centerXIndex}
            animationDuration={this.state.animationDuration}
            backgroundColor={this.props.backgroundColor}
          >
            {content1}
          </Pane>
        </PaneWrapper>
        <PaneWrapper 
          isAnimating={this.state.isAnimating}  
          xDirection={this.state.xDirection} 
          paneXIndex={1} 
          centerXIndex={this.state.centerXIndex} 
          leftXIndex={this.state.leftXIndex} 
          rightXIndex={this.state.rightXIndex} 
          animationDuration={this.state.animationDuration}
        >
          <Pane 
            isAnimating={this.state.isAnimating} 
            xDirection={this.state.xDirection} 
            paneXIndex={1} 
            centerXIndex={this.state.centerXIndex}
            animationDuration={this.state.animationDuration}
            backgroundColor={this.props.backgroundColor}
          >
            {content2}
          </Pane>
        </PaneWrapper>
        <PaneWrapper 
          isAnimating={this.state.isAnimating}  
          xDirection={this.state.xDirection} 
          paneXIndex={2} 
          centerXIndex={this.state.centerXIndex} 
          leftXIndex={this.state.leftXIndex} 
          rightXIndex={this.state.rightXIndex} 
          animationDuration={this.state.animationDuration}
        >
          <Pane 
            isAnimating={this.state.isAnimating} 
            xDirection={this.state.xDirection} 
            paneXIndex={2} 
            centerXIndex={this.state.centerXIndex}
            animationDuration={this.state.animationDuration}
            backgroundColor={this.props.backgroundColor}
          >
            {content3}

          </Pane>
        </PaneWrapper>

        <LeftButton onClick={this.nextXPane.bind(this, 'left')}><Arrow src={require('./img/arrow.png')} /></LeftButton>
        <RightButton onClick={this.nextXPane.bind(this, 'right')}><Arrow src={require('./img/arrow.png')} /></RightButton>
      </Container>
    )
  }


  nextXPane(direction) {

    if (this.state.isAnimating) return

    const elements = this.props.elements || ['Pane #1', 'Pane #2', 'Pane #3']

    this.setState({
      xDirection: direction, 
      isAnimating: true, 
      animationDuration: ANIMATION_DURATION
    }, () => {

      setTimeout(() => {
        let centerXIndex, elementXIndex
        if (direction === 'left') {
          centerXIndex = this.state.centerXIndex === 0 ? 2 : this.state.centerXIndex - 1
          elementXIndex = this.state.elementXIndex === 0 ? elements.length - 1 : this.state.elementXIndex - 1
        }
        if (direction === 'right') {
          centerXIndex = this.state.centerXIndex === 2 ? 0 : this.state.centerXIndex + 1
          elementXIndex = this.state.elementXIndex === elements.length - 1 ? 0 : this.state.elementXIndex + 1
        }

        const leftXIndex = centerXIndex === 0 ? 2 : centerXIndex - 1
        const rightXIndex = centerXIndex === 2 ? 0 : centerXIndex + 1

        this.setState({
          isAnimating: false, 
          animationDuration: 0, 
          elementXIndex: elementXIndex, 
          centerXIndex: centerXIndex, 
          leftXIndex: leftXIndex, 
          rightXIndex: rightXIndex
        })
      }, ANIMATION_DURATION)
    })
  }
}
