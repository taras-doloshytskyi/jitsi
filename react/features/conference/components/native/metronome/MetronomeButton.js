import { AbstractButton, type AbstractButtonProps } from '../../../../base/toolbox/components';
import { IconMetronome } from '../../../../base/icons';
import { translate } from '../../../../base/i18n';
import { connect } from '../../../../base/redux';
import { screen } from '../../../../mobile/navigation/routes';
import { navigate } from '../../../../mobile/navigation/components/conference/ConferenceNavigationContainerRef';

class MetronomeButton extends AbstractButton<AbstractButtonProps, *> {
  accessibilityLabel = 'toolbar.accessibilityLabel.document';
  icon = IconMetronome;
  label = 'toolbar.metronome';
  tooltip = 'toolbar.metronome';

  _handleClick() {
    return navigate(screen.conference.metronome);
  }
}

function _mapStateToProps(state: Object, ownProps: Object) {
  // const { documentUrl } = state['features/etherpad'];
  // const { visible = true } = ownProps;

  // console.log(documentUrl);

  return {};
}

export default translate(connect(_mapStateToProps)(MetronomeButton));
