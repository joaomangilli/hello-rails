require "test_helper"

class HelloControllerTest < ActionDispatch::IntegrationTest
  test "root returns hello as JSON" do
    get root_url
    assert_response :success
    assert_equal "application/json", response.media_type
    assert_equal({ "message" => "hello" }, response.parsed_body)
  end
end
