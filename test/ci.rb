ENV['APP_ENV'] = 'test'

require_relative '../app/server.rb'
require 'test/unit'
require 'rack/test'

class AppServerTest < Test::Unit::TestCase
  include Rack::Test::Methods

  def app
    Sinatra::Application
  end

  def test_homepage_includes_expected_keywords
    get '/'
    assert last_response.ok?
    last_response.body.include?('Open Access')
    last_response.body.include?('Repository Holdings')
  end

  def test_unit_static_page_includes_expected_keywords
    get '/uc/uclalaw/policyStatement'
    assert last_response.ok?
    last_response.body.include?('School of Law only publishes materials about')
  end

  def test_root_static_page_includes_expected_keywords
    get '/aboutEschol'
    assert last_response.ok?
    last_response.body.include?('provides scholarly publishing')
  end

end