import React, { Component } from 'react';
import Router from 'next/router';
import styled from 'styled-components';

import connect from '../../store/connect';
import colors from '../../utils/colors';
import Stepper from '../../component/Register/Stepper';
import StepOne from '../../component/Register/StepOne';
import StepTwo from '../../component/Register/StepTwo';
import StepThree from '../../component/Register/StepThree';
import FullAreaLoader from '../../component/Core/FullAreaLoader';
import { actions as registerActions } from '../../store/reducers/register';

const routerNavigate = step => Router.push('/registration', `/register/step${step}`);

const RegisterContainer = styled.div.attrs({
  className: 'container'
})`
  padding: 25px 0;
`;

const StepWrapper = styled.div`
  position: relative;
  pointer-events: none;
  @media(max-width: 768px) {
    margin: 15px 20px;
  }
  &:before {
    display: block;
    content: "";
    width: 50%;
    height: 25%;
    left: 0px;
    position: absolute;
    border-top: 4px solid ${colors.cyan};
    border-left: 4px solid ${colors.cyan};
  }
  &:after {
    display: block;
    content: "";
    width: 50%;
    height: 25%;
    position: absolute;
    top: 0px;
    right: 0px;
    border-top: 4px solid ${colors.cyan};
    border-right: 4px solid ${colors.cyan};
  }
`;

const StepInner = styled.div`
  padding: 30px 20px;
  border: 1px solid #83beea;
  position: relative;
  &:before {
    display: block;
    content: "";
    width: 50%;
    height: 25%;
    position: absolute;
    bottom: 0px;
    left: 0px;
    border-bottom: 4px solid ${colors.cyan};
    border-left: 4px solid ${colors.cyan};
  }
  &:after {
    display: block;
    content: "";
    width: 50%;
    height: 25%;
    position: absolute;
    bottom: 0px;
    right: 0px;
    border-bottom: 4px solid ${colors.cyan};
    border-right: 4px solid ${colors.cyan};
  }
`;

const LoaderWrapper = styled.div`
  z-index: 300;
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.6);
  ${props => props.error && 'background-color: rgba(0, 0, 0, 0.9);'}
  pointer-events: auto;
  p {
    margin-top: 14px;
    font-size: 26px;
    color: ${colors.red};
  }
  @media(max-width: 768px) {
    position: fixed;
  }
`;

@connect(
  state => ({
    registerData: state.register,
    error: state.register.error,
    errorValidation: state.register.errorValidation,
    isLogin: state.auth.isLogin
  }),
  { ...registerActions }
)
export default class MainRegistration extends Component {
  componentDidMount() {
    if (!this.props.isLogin) {
      // Router.push('/landing', '/');
    }
  }

  render() {
    const { proceedStepOne, proceedStepTwo, proceedStepThree, registerData, navigateStep, error, errorValidation } = this.props;
    const { currentStep, saving, major } = registerData;
    return (
      <RegisterContainer>
        <Stepper step={currentStep} major={major} />
        <StepWrapper>
          <StepInner>
            {currentStep === 1 && (
              <StepOne
                {...registerData}
                onSubmit={() => proceedStepOne(registerData).then(() => routerNavigate(2))}
              />
            )}
            {currentStep === 2 && (
              <StepTwo
                {...registerData}
                onSubmit={() => proceedStepTwo(registerData).then(() => routerNavigate(3))}
                onBack={() => {
                  navigateStep(1);
                  routerNavigate(1);
                }}
              />
            )}
            {currentStep === 3 && (
              <StepThree
                {...registerData}
                onSubmit={() => proceedStepThree(registerData).then(() => routerNavigate(4))}
                onBack={() => {
                  navigateStep(2);
                  routerNavigate(2);
                }}
              />
            )}
          </StepInner>
          {(saving || (error && errorValidation.length === 0)) && (
            <LoaderWrapper error={error}>
              <FullAreaLoader />
              {error && <p><b>Error:</b> {error.message}</p>}
            </LoaderWrapper>
          )}
          <style jsx global>{`
            .column {
              padding-top: 8px;
              padding-bottom: 8px;
              margin-bottom: 0;
              @media(max-width: 768px) {
                padding-top: 0.75rem;
              }
            }  
          `}</style>
        </StepWrapper>
      </RegisterContainer>
    );
  }
}
