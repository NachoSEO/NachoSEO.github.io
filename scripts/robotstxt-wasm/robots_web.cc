// Binding de la librería oficial de Google (github.com/google/robotstxt) para la web.
// Expone el veredicto con la línea que lo decide y el informe por línea de reporting_robots,
// la parte que usa Search Console en su informe de robots.txt.
#include <emscripten/bind.h>
#include <emscripten/val.h>

#include <string>

#include "reporting_robots.h"
#include "robots.h"

using emscripten::val;

// Si `user_agent` puede rastrear `url` (con %-encoding RFC 3986) y qué línea lo decide (0 = ninguna)
val Check(const std::string& robots, const std::string& user_agent, const std::string& url) {
  googlebot::RobotsMatcher matcher;
  const bool allowed = matcher.OneAgentAllowedByRobots(robots, user_agent, url);
  val result = val::object();
  result.set("allowed", allowed);
  result.set("line", matcher.matching_line());
  result.set("specificAgent", matcher.ever_seen_specific_agent());
  return result;
}

bool IsValidUserAgent(const std::string& user_agent) {
  return googlebot::RobotsMatcher::IsValidUserAgentToObey(user_agent);
}

// Una entrada por línea: tag 0 desconocida, 1 user-agent, 2 allow, 3 disallow, 4 sitemap, 5 reconocida pero sin uso
val Report(const std::string& robots) {
  googlebot::RobotsParsingReporter reporter;
  googlebot::ParseRobotsTxt(robots, &reporter);
  val lines = val::array();
  for (const auto& parsed : reporter.parse_results()) {
    val line = val::object();
    line.set("line", parsed.line_num);
    line.set("tag", static_cast<int>(parsed.tag_name));
    line.set("typo", parsed.is_typo);
    line.set("missingColon", parsed.metadata.is_missing_colon_separator);
    line.set("tooLong", parsed.metadata.is_line_too_long);
    line.set("comment", parsed.metadata.is_comment);
    line.set("empty", parsed.metadata.is_empty);
    lines.call<void>("push", line);
  }
  val result = val::object();
  result.set("lines", lines);
  result.set("validDirectives", reporter.valid_directives());
  result.set("unusedDirectives", reporter.unused_directives());
  return result;
}

EMSCRIPTEN_BINDINGS(robotstxt) {
  emscripten::function("check", &Check);
  emscripten::function("isValidUserAgent", &IsValidUserAgent);
  emscripten::function("report", &Report);
}
