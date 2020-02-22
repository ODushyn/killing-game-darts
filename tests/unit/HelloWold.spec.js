import { expect } from 'chai'
import { shallowMount } from '@vue/test-utils'
import HelloWorld from '@/components/Game.vue'

describe('Game.vue', () => {
  it('renders props.msg when passed', () => {
    const players = [];
    const wrapper = shallowMount(HelloWorld, {
      propsData: { players }
    });
    expect(wrapper.text()).to.include(players)
  });
});
