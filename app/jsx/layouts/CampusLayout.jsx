import React from 'react'
import PropTypes from 'prop-types'
import CampusSearchComp from '../components/CampusSearchComp.jsx'
import HeatMapComp from '../components/HeatMapComp.jsx'
import StatCarouselComp from '../components/StatCarouselComp.jsx'
import UnitCarouselComp from '../components/UnitCarouselComp.jsx'
import JournalCarouselComp from '../components/JournalCarouselComp.jsx'
import NotYetLink from '../components/NotYetLink.jsx'
import { Link } from 'react-router'

class CampusLayout extends React.Component {
  static propTypes = {
    data:  PropTypes.shape({
      contentCar1: PropTypes.shape({
        mode: PropTypes.string,
        data: PropTypes.shape({
          titleID: PropTypes.string,
          titleName: PropTypes.string,
          slides:  PropTypes.array,
  // slide data for JournalCarousel:
  //          unit_id: PropTypes.string,
  //          name: PropTypes.string,
  //          cover: PropTypes.shape({
  //            width: PropTypes.number,
  //            height: PropTypes.number,
  //            asset_id: PropTypes.string,
  //          }),
  // slide data for UnitCarousel:
  //          id: PropTypes.string,
  //          title: PropTypes.string,
  //          authors: PropTypes.array,
  //          genre: PropTypes.string,
        }),
      }),
   // contentCar2: // Same as above
      journal_count: PropTypes.number,
      opened_count: PropTypes.number,
      pub_count: PropTypes.number,
      unit_count: PropTypes.number,
      view_count: PropTypes.number
    })
  }

  renderCampusCarousel(contentCarousel) {
    // Most recent 10 journals for this campus
    if (contentCarousel.mode == 'journals') return (
      <JournalCarouselComp {...contentCarousel.data} />
    )
    // Most recent 10 articles for chosen unit (configured by admin)
    if (contentCarousel.mode == 'unit') return (
      <UnitCarouselComp {...contentCarousel.data} />
    )
  }

  render() {
    let data = this.props.data,
        unit = this.props.unit
    return (
      <div>
        <HeatMapComp campusID={unit.id} />
        <StatCarouselComp campusName={unit.name} />
        <div className="c-columns">
          <main id="maincontent">
            <CampusSearchComp campusID={unit.id} campusName={unit.name} />
         {data.contentCar1 && data.contentCar1.mode && data.contentCar1.mode != 'disabled' && data.contentCar1.data &&
            this.renderCampusCarousel(data.contentCar1)
         }
         {data.contentCar2 && data.contentCar2.mode && data.contentCar2.mode != 'disabled' && data.contentCar2.data &&
            this.renderCampusCarousel(data.contentCar2)
         }
          </main>
          <aside>
            {this.props.sidebar}
          </aside>
        </div>
      </div>
    )
  }
}

module.exports = CampusLayout
