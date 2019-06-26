import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  PanGestureHandler,
  PinchGestureHandler,
  RotationGestureHandler,
  State,
} from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';

const { set, cond, block, eq, add, Value, event, concat, multiply } = Animated;

export default class Example extends Component {
  constructor(props) {
    super(props);
    this.X = new Value(0);
    this.Y = new Value(0);
    this.Z = new Value(1);
    const offsetX = new Value(0);
    const offsetY = new Value(0);
    const offsetZ = new Value(1);

    this.handlePan = event([
      {
        nativeEvent: ({ translationX: x, translationY: y, state }) =>
          block([
            set(this.X, add(x, offsetX)),
            set(this.Y, add(y, offsetY)),
            cond(eq(state, State.END), [
              set(offsetX, add(offsetX, x)),
              set(offsetY, add(offsetY, y)),
            ]),
          ]),
      },
    ]);

    this.handleZoom = event([
      {
        nativeEvent: ({ scale: z, state }) =>
          block([
            cond(eq(state, State.ACTIVE), set(this.Z, multiply(z, offsetZ))),
            cond(eq(state, State.END), [set(offsetZ, multiply(offsetZ, z))]),
          ]),
      },
    ]);
  }

  panRef = React.createRef();
  pinchRef = React.createRef();

  render() {
    return (
      <View style={styles.container}>
        <PanGestureHandler
          ref={this.panRef}
          simultaneousHandlers={[this.pinchRef]}
          onGestureEvent={this.handlePan}
          onHandlerStateChange={this.handlePan}>
          <Animated.View>
            <PinchGestureHandler
              ref={this.pinchRef}
              simultaneousHandlers={[this.panRef]}
              onGestureEvent={this.handleZoom}
              onHandlerStateChange={this.handleZoom}>
              <Animated.View>
                  <Animated.Image
                    resizeMode="stretch"
                    style={[
                      styles.box,
                      {
                        transform: [
                          { translateX: this.X },
                          { translateY: this.Y },
                          { scale: this.Z },
                          
                        ],
                      },
                    ]}
                    source={require('./react-hexagon.png')}
                  />
              </Animated.View>
            </PinchGestureHandler>
          </Animated.View>
        </PanGestureHandler>
      </View>
    );
  }
}

const IMAGE_SIZE = 200;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  box: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
  },
  rectangle: {
    width: 100,
    height:100,
    backgroundColor: '#FFC107',
  }
});
